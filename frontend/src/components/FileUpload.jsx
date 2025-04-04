import React, { useState } from 'react';
import '../styles/FileUpload.css';
import { ENDPOINTS } from '../config';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allowedTypes = [
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/json',
    'application/sql'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    
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
    setAnalysis('');

    try {
      const data = await handleFileUploadHelper(file);
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to upload and analyze file');
    } finally {
      setLoading(false);
    }
  };

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

    const data = await response.json();
    return data;
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
      
      {analysis && (
        <div className="analysis-result">
          <h3>Analysis Result:</h3>
          <pre>{analysis}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;