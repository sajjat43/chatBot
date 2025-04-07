import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import '../styles/Chat.css';

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="message-icon">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>
);

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="message-icon">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
  </svg>
);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    fetchUploadedFiles();
  }, [messages]);

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/files');
      if (response.ok) {
        const files = await response.json();
        setUploadedFiles(files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);

    // Read file content
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      setFileContent(content);
      
      // Show file upload message
      setMessages(prev => [...prev, {
        sender: 'system',
        text: `File selected: ${selectedFile.name}`
      }]);
    };

    reader.onerror = (error) => {
      setError('Error reading file');
      setFile(null);
      setFileContent(null);
    };

    reader.readAsText(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // If there's no input but there's a file, submit the file
    if ((!input.trim() && file) || (input.trim() && file)) {
      setLoading(true);
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (input.trim()) {
          formData.append('message', input.trim());
        }

        setMessages(prev => [...prev, {
          sender: 'system',
          text: `Processing file: ${file.name}...`
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

        // Remove processing message
        setMessages(prev => prev.filter(msg => 
          msg.text !== `Processing file: ${file.name}...`
        ));

        // Add user message if there was input
        if (input.trim()) {
          setMessages(prev => [...prev, {
            sender: 'user',
            text: input.trim()
          }]);
        }

        // Add bot response
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: data.analysis || 'File processed successfully'
        }]);

        // Clear input and file after successful upload
        setInput('');
        setFile(null);
        setFileContent(null);

        // Update the files list after successful upload
        fetchUploadedFiles();
        
        // Set the newly uploaded file as selected
        setSelectedFileId(data.fileId);

      } catch (error) {
        console.error('Upload error:', error);
        setError(error.message || 'Failed to upload file');
        
        setMessages(prev => prev.filter(msg => 
          msg.text !== `Processing file: ${file.name}...`
        ));
      } finally {
        setLoading(false);
      }
    } 
    // Regular chat message without file
    else if (input.trim()) {
      setLoading(true);
      const userMessage = input.trim();
      setInput('');

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
          body: JSON.stringify({ 
            message: userMessage,
            fileId: selectedFileId 
          }),
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
    }
  };

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const MarkdownMessage = ({ content }) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    );
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
              <div className="message-content">
                <div className="message-header">
                  <div className="message-icon-name">
                    {message.sender === 'user' ? <UserIcon /> : <BotIcon />}
                    <span className="sender-name">
                      {message.sender === 'user' ? 'You' : 'Assistant'}
                    </span>
                  </div>
                  <span className="timestamp">{formatTimestamp()}</span>
                </div>
                <div className="message">
                  <MarkdownMessage content={message.text} />
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-container bot">
              <div className="message-content">
                <div className="message-header">
                  <div className="message-icon-name">
                    <BotIcon />
                    <span className="sender-name">Assistant</span>
                  </div>
                </div>
                <div className="message">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
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

      <div className="uploaded-files">
        <select 
          value={selectedFileId || ''} 
          onChange={(e) => setSelectedFileId(e.target.value || null)}
        >
          <option value="">No file selected (general chat)</option>
          {uploadedFiles.map(file => (
            <option key={file.id} value={file.id}>
              {file.name}
            </option>
          ))}
        </select>
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
            placeholder={file ? `File selected: ${file.name}. Add a message or click Send` : "Type your message..."}
            rows="1"
            className="chat-input"
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading || (!input.trim() && !file)}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat; 