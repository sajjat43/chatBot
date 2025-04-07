import React from 'react';
import './App.css';
import Chat from './components/Chat';
// import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="app">
      <header>
        <div className="header-content">
          <h1>AI Chatbot</h1>
        </div>
      </header>
      <main>
        {/* <FileUpload /> */}
        <Chat />
      </main>
    </div>
  );
}

export default App;
