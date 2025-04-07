import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chat.css';

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
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      setMessages(prev => [...prev, {
        sender: 'system',
        text: `Processing file: ${selectedFile.name}...`
      }]);

      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();

      setMessages(prev => prev.filter(msg => 
        msg.text !== `Processing file: ${selectedFile.name}...`
      ));

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.analysis || 'File processed successfully'
      }]);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload file');
      
      setMessages(prev => prev.filter(msg => 
        msg.text !== `Processing file: ${selectedFile.name}...`
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    handleFileUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setError(null);

    setMessages(prev => [...prev, {
      sender: 'user',
      text: userMessage
    }]);

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.response
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

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