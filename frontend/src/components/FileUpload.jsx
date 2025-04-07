import React, { useState } from 'react';
import '../styles/FileUpload.css';
import { ENDPOINTS } from '../config';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);

  const allowedTypes = [
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/json',
    'application/sql'
  ];

  const handleFileUploadHelper = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(ENDPOINTS.UPLOAD, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    return await response.json();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setMessages([]);
    
    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a text, markdown, CSV, JSON, or SQL file');
      setFile(null);
      return;
    }
    
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const data = await handleFileUploadHelper(file);
      setMessages([{
        type: 'system',
        content: 'File uploaded successfully. You can now ask questions about the file.'
      }, {
        type: 'analysis',
        content: data.analysis
      }]);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to upload and analyze file');
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !file) return;

    const userPrompt = prompt.trim();
    setPrompt('');
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('prompt', userPrompt);

      setMessages(prev => [...prev, {
        type: 'user',
        content: userPrompt
      }]);

      const response = await fetch(ENDPOINTS.ANALYZE, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed with status ${response.status}`);
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        type: 'ai',
        content: data.response
      }]);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to analyze prompt');
      
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <form onSubmit={handleFileUpload}>
        <div className="file-input-wrapper">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            accept=".txt,.md,.csv,.json,.sql"
          />
          <button type="submit" disabled={!file || loading}>
            {loading ? 'Analyzing...' : 'Upload & Analyze'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.type === 'system' && <div className="system-badge">System</div>}
            {message.type === 'user' && <div className="user-badge">You</div>}
            {message.type === 'ai' && <div className="ai-badge">AI</div>}
            <div className="message-content">{message.content}</div>
          </div>
        ))}
      </div>

      {file && (
        <form onSubmit={handlePromptSubmit} className="prompt-form">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a question about the file..."
            className="prompt-input"
            disabled={loading}
          />
          <button type="submit" disabled={!prompt.trim() || loading}>
            {loading ? 'Processing...' : 'Ask'}
          </button>
        </form>
      )}
    </div>
  );
};

export default FileUpload;