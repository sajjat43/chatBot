const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

let ollamaReady = false;
let modelLoaded = false;
console.log('Initial Ollama status:', { ollamaReady, modelLoaded });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Check if the route exists
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: ollamaReady ? 'ok' : 'error',
    modelLoaded: modelLoaded,
    message: ollamaReady ? 'Service is ready' : 'Service is not ready'
  });
});

// Main chat endpoint with simplified error handling
app.post('/api/chat', async (req, res) => {
  console.log('Received chat request:', req.body);
  
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Message is required' 
      });
    }

    // Force check Ollama before proceeding
    const ollamaStatus = await checkOllamaAsync();
    if (!ollamaStatus) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Ollama service is not ready'
      });
    }

    // Set a timeout for the Ollama process
    const timeout = 25000; // 25 seconds
    let timeoutId;

    const child = spawn('ollama', ['run', 'deepseek-r1:14b'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const killProcess = () => {
      if (child.killed) return;
      child.kill();
      res.status(504).json({
        error: 'Gateway Timeout',
        message: 'Request timed out'
      });
    };

    timeoutId = setTimeout(killProcess, timeout);

    child.stdin.write(message + '\n');
    child.stdin.end();

    let response = '';

    child.stdout.on('data', (data) => {
      response += data.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timeoutId);
      
      if (code === 0) {
        res.json({ response: response.trim() });
      } else {
        res.status(500).json({
          error: 'Server Error',
          message: 'Failed to process request'
        });
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeoutId);
      console.error('Child process error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to start model process'
      });
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
});

// Add file upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    
    // Create a prompt for Ollama to analyze the file
    const prompt = `Please analyze this file content and provide a summary:\n\n${fileContent}`;
    
    const child = spawn('ollama', ['run', 'mistral', prompt], {
      env: { ...process.env, OLLAMA_HOST: 'http://localhost:11434' }
    });

    let analysis = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      analysis += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      // Clean up the uploaded file
      fs.unlinkSync(req.file.path);
      
      if (code === 0 && analysis) {
        res.json({ analysis: analysis.trim() });
      } else {
        res.status(500).json({ 
          error: 'Analysis failed',
          message: errorOutput || 'Failed to analyze file'
        });
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Server Error',
    message: 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Initial Ollama check
  checkOllamaAsync();
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is busy. Please try these solutions:`);
    console.error('1. Kill the existing process:');
    console.error('   Linux/Mac: sudo kill -9 $(lsof -t -i:' + PORT + ')');
    console.error('   Windows: taskkill /PID $(netstat -ano | findstr :' + PORT + ')');
    console.error('2. Or use a different port:');
    console.error('   PORT=5001 node backend/index.js');
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

// Async function to check Ollama status
async function checkOllamaAsync() {
  return new Promise((resolve) => {
    console.log('Checking Ollama status...');
    
    const check = spawn('ollama', ['list']);
    let output = '';
    
    check.stdout.on('data', (data) => {
      output += data.toString();
      console.log('Available models:', output);
      
      // Changed to check for deepseek-r1:14b
      if (output.includes('deepseek-r1:14b')) {
        ollamaReady = true;
        modelLoaded = true;
        console.log('✅ Ollama is ready with deepseek-r1:14b model');
      } else {
        console.log('❌ deepseek-r1:14b model not found');
        // Try to pull the model if not found
        pullDeepseekModel();
      }
    });

    check.on('close', (code) => {
      resolve(code === 0);
    });

    check.on('error', (error) => {
      console.error('Failed to check Ollama:', error);
      ollamaReady = false;
      modelLoaded = false;
      resolve(false);
    });
  });
}

// Function to pull the Deepseek model
function pullDeepseekModel() {
  console.log('Pulling deepseek-r1:14b model...');
  const pull = spawn('ollama', ['pull', 'deepseek-r1:14b']);
  
  pull.stdout.on('data', (data) => {
    console.log('Pull progress:', data.toString());
  });
  
  pull.on('close', (code) => {
    if (code === 0) {
      console.log('✅ deepseek-r1:14b model pulled successfully');
      ollamaReady = true;
      modelLoaded = true;
    } else {
      console.error('❌ Failed to pull deepseek-r1:14b model');
    }
  });
}

// Check Ollama periodically
setInterval(() => checkOllamaAsync(), 30000);