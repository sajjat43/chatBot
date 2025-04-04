import React from 'react';
import Chat from './components/Chat';
import FileUpload from './components/FileUpload';
import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>AI Chatbot</h1>
      </header>
      <main>
        <FileUpload />
        <Chat />
      </main>
    </div>
  );
}

export default App;
