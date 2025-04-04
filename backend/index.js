const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

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
  res.json({ status: 'ok' });
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

    // Update timeout to 60 seconds
    const timeout = 600000;

    // Modified executeOllama function
    const executeOllama = () => {
      return new Promise((resolve, reject) => {
        const child = spawn('ollama', ['run', 'deepseek-r1:14b'], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let response = '';
        let error = '';

        // Handle stdout in chunks
        child.stdout.on('data', (data) => {
          response += data.toString();
        });

        child.stderr.on('data', (data) => {
          console.error('Ollama stderr:', data.toString());
          error += data.toString();
        });

        child.on('error', (err) => {
          console.error('Spawn error:', err);
          reject(err);
        });

        // Handle process completion
        child.on('close', (code) => {
          console.log('Ollama process closed with code:', code);
          console.log('Final response:', response);
          if (code === 0) {
            resolve(response);
          } else {
            reject(new Error(`Process exited with code ${code}: ${error}`));
          }
        });

        // Write the message and add a clear EOF marker
        child.stdin.write(message + '\n');
        child.stdin.end();

        // Set timeout
        const timeoutId = setTimeout(() => {
          if (!child.killed) {
            child.kill();
            reject(new Error('Operation timed out'));
          }
        }, timeout);

        // Clear timeout if process ends normally
        child.on('close', () => clearTimeout(timeoutId));
      });
    };

    // Execute the Ollama command
    const response = await executeOllama();
    
    // Clean up the response and ensure it's not empty
    const cleanedResponse = response
      .replace(/<think>/g, '')
      .replace(/<\/think>/g, '')
      .trim();

    if (!cleanedResponse) {
      throw new Error('Empty response from model');
    }

    // Send the response
    res.json({ response: cleanedResponse });

  } catch (error) {
    console.error('Chat error:', error);
    
    if (!res.headersSent) {
      const statusCode = error.message.includes('timed out') ? 504 : 500;
      res.status(statusCode).json({
        error: 'Server Error',
        message: error.message || 'Failed to process request'
      });
    }
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
      message: 'File uploaded successfully',
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
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
const checkOllamaAsync = async () => {
  try {
    const child = spawn('ollama', ['list']);
    return new Promise((resolve) => {
      child.on('close', (code) => {
        resolve(code === 0);
      });
    });
  } catch (error) {
    return false;
  }
};

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