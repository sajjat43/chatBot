const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Add file tracking storage
const uploadedFiles = new Map();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileId = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${fileId}${ext}`);
  }
});

// Updated file filter with more mime types and better validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/plain',
    'text/csv',
    'application/json',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/pdf',
    'text/javascript',
    'application/javascript',
    'text/html',
    'text/css',
    'application/x-httpd-php',
    'text/x-python',
    'text/x-java',
    'text/x-c',
    'text/x-c++',
    'text/xml',
    'application/xml',
    'text/x-ruby',
    'text/x-php',
    'text/x-sql',
    'application/sql',
    // Add common code file extensions
    'text/x-typescript',
    'text/jsx',
    'text/tsx'
  ];

  // Check file extension as fallback
  const allowedExtensions = [
    '.txt', '.csv', '.json', '.md', '.doc', '.docx', 
    '.pdf', '.js', '.html', '.css', '.php', '.py', 
    '.java', '.c', '.cpp', '.xml', '.rb', '.sql',
    '.ts', '.jsx', '.tsx'
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types are: ${allowedExtensions.join(', ')}`));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Wrap multer upload in a promise with better error handling
const uploadMiddleware = (req, res) => {
  return new Promise((resolve, reject) => {
    upload.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        reject(new Error(`Upload error: ${err.message}`));
      } else if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Helper function to execute Ollama
async function executeOllama(prompt) {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        prompt: prompt,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Ollama execution error:', error);
    throw new Error('Failed to process with AI model');
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Updated upload endpoint with better error handling
app.post('/api/upload', async (req, res) => {
  try {
    await uploadMiddleware(req, res);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read file content
    const fileContent = await fs.promises.readFile(req.file.path, 'utf8');
    
    // Store file information
    const fileInfo = {
      id: path.parse(req.file.filename).name,
      originalName: req.file.originalname,
      path: req.file.path,
      content: fileContent,
      uploadDate: new Date().toISOString()
    };
    
    uploadedFiles.set(fileInfo.id, fileInfo);

    // Initial analysis with Ollama
    const ollamaResponse = await executeOllama(
      `Analyze this file content and provide a brief summary:\n\n${fileContent}`
    );

    res.json({
      success: true,
      fileId: fileInfo.id,
      fileName: fileInfo.originalName,
      analysis: ollamaResponse,
      message: 'File processed successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process file'
    });
  }
});

// Add endpoint to list uploaded files
app.get('/api/files', (req, res) => {
  const files = Array.from(uploadedFiles.values()).map(file => ({
    id: file.id,
    name: file.originalName,
    uploadDate: file.uploadDate
  }));
  res.json(files);
});

// Update chat endpoint to include file context
app.post('/api/chat', async (req, res) => {
  try {
    const { message, fileId } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let prompt = message;
    
    // If fileId is provided, include file content in the context
    if (fileId) {
      const fileInfo = uploadedFiles.get(fileId);
      if (fileInfo) {
        prompt = `Context from file "${fileInfo.originalName}":\n${fileInfo.content}\n\nUser question: ${message}`;
      }
    }

    const response = await executeOllama(prompt);
    res.json({ response });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload directory: ${uploadDir}`);
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});