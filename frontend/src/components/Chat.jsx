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

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamResponse = (response) => {
    return new Promise((resolve) => {
      const words = response.split(' ');
      let currentIndex = 0;
      
      const streamInterval = setInterval(() => {
        if (currentIndex < words.length) {
          setStreamingText(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(streamInterval);
          resolve();
        }
      }, 50); // Adjust speed here (lower = faster)
    });
  };

  const sendMessage = async (text, retryCount = 0) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    setStreamingText('');
    
    const userMessage = { 
      text, 
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

      const response = await fetch(ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || data.error);
      }

      if (!data.response) {
        throw new Error('Empty response from server');
      }

      // Stream the response
      await streamResponse(data.response);
      
      // After streaming is complete, add the message
      setMessages(prev => [...prev, { 
        text: data.response, 
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      }]);
      setStreamingText('');
    } catch (err) {
      console.error('Error in sendMessage:', err);
      
      if (err.name === 'AbortError') {
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES})...`);
          setError(`Request timed out. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          
          // Retry the request
          return sendMessage(text, retryCount + 1);
        } else {
          setError('Request timed out after multiple retries. Please try again.');
        }
      } else {
        setError(err.message || 'Failed to get response. Please try again.');
      }
      
      // Remove the user's message if all retries failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
      e.preventDefault();
      await sendMessage(input.trim());
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-wrapper">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-container ${message.sender === 'user' ? 'user' : 'bot'}`}
            >
              <MessageContent text={message.text} />
            </div>
          ))}
          {loading && (
            <div className="message-container bot">
              <div className="message">
                {streamingText ? (
                  <MessageContent text={streamingText} />
                ) : (
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
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
      
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={loading}
          rows="1"
          className="chat-input"
        />
        <button 
          onClick={() => input.trim() && sendMessage(input.trim())}
          disabled={!input.trim() || loading}
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;