import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chat.css';
import { ENDPOINTS } from '../config';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TIMEOUT_DURATION = 650000; // 65 seconds timeout (slightly longer than backend)
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const MessageContent = ({ text }) => {
  // Function to detect if text is code and what language it might be
  const isCodeBlock = (text) => {
    const codePatterns = {
      javascript: /^(const|let|var|function|class|import|export|return|if|for|while)/m,
      python: /^(def|class|import|from|if|for|while|return)/m,
      html: /^(<html|<div|<body|<head|<!DOCTYPE)/m,
      css: /^(\.|#|body|html|@media|@import)/m,
      json: /^[\s]*[{[]/m
    };

    for (const [language, pattern] of Object.entries(codePatterns)) {
      if (pattern.test(text.trim())) {
        return language;
      }
    }
    return null;
  };

  const detectAndFormatCode = (text) => {
    const language = isCodeBlock(text);
    if (language) {
      return (
        <div className="code-block-container">
          <div className="code-header">
            <span className="language-label">{language}</span>
          </div>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: '0 0 4px 4px',
              padding: '1em'
            }}
          >
            {text}
          </SyntaxHighlighter>
        </div>
      );
    }
    return <span>{text}</span>;
  };

  return <div className="message">{detectAndFormatCode(text)}</div>;
};

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingText, setStreamingText] = useState('');
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setError(null);
    
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, TXT, CSV, or ODT file');
      setFile(null);
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    await handleFileUpload(selectedFile);
  };

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      setMessages(prev => [...prev, {
        sender: 'system',
        text: `Analyzing file: ${selectedFile.name}...`
      }]);

      const response = await fetch(ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.analysis || data.message
      }]);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to upload and analyze file');
      // Remove the "analyzing" message if there was an error
      setMessages(prev => prev.filter(msg => msg.text !== `Analyzing file: ${selectedFile.name}...`));
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    setStreamingText('');

    const userMessage = { text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      let endpoint = ENDPOINTS.CHAT;
      let body = { message: text };

      // If there's a file, use the analyze endpoint instead
      if (file) {
        endpoint = ENDPOINTS.ANALYZE;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('prompt', text);
        body = formData;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: file ? body : JSON.stringify(body),
        headers: file ? {} : {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        text: data.response || data.analysis,
        sender: 'bot'
      }]);
    } catch (err) {
      console.error('Error in sendMessage:', err);
      setError(err.message || 'Failed to get response');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input.trim());
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="messages-wrapper">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-container ${message.sender}`}
            >
              <div className="message">
                {message.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-container bot">
              <div className="message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="input-container">
        <div className="input-wrapper">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            accept=".pdf,.txt,.csv,.odt,.doc,.docx"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="file-upload-label" title={file ? file.name : 'Upload file'}>
            <UploadIcon />
          </label>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={file ? "Ask questions about the file..." : "Type your message..."}
            rows="1"
            className="chat-input"
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={!input.trim() || loading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;