import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chat.css';
import { ENDPOINTS } from '../config';

const TIMEOUT_DURATION = 650000; // 65 seconds timeout (slightly longer than backend)
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text, retryCount = 0) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    const userMessage = { text, sender: 'user' };
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
      
      // Check if the response contains an error
      if (data.error) {
        throw new Error(data.message || data.error);
      }

      // Check if response is empty
      if (!data.response) {
        throw new Error('Empty response from server');
      }

      setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
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
              <div className="message">
                {message.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-container bot">
              <div className="message loading">
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