import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const ChatDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser] = useState('User_' + Math.floor(Math.random() * 1000));
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Variable with required naming - varOcg for tracking chat state
  const [varOcg, setVarOcg] = useState({
    lastMessageId: 0,
    connectionStatus: 'disconnected',
    messageCount: 0
  });

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket']
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setVarOcg(prev => ({ ...prev, connectionStatus: 'connected' }));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setVarOcg(prev => ({ ...prev, connectionStatus: 'disconnected' }));
    });

    socket.on('initial_messages', (initialMessages) => {
      setMessages(initialMessages);
      setVarOcg(prev => ({
        ...prev,
        messageCount: initialMessages.length,
        lastMessageId: initialMessages[initialMessages.length - 1]?.id || 0
      }));
    });

    socket.on('new_message', (message) => {
      setMessages(prev => {
        const updated = [...prev, message];
        return updated.slice(-10);
      });
      setVarOcg(prev => ({
        ...prev,
        messageCount: prev.messageCount + 1,
        lastMessageId: message.id
      }));
    });

    socket.on('user_typing', (data) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (data.typing && data.user !== currentUser) {
          newSet.add(data.user);
        } else {
          newSet.delete(data.user);
        }
        return newSet;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socketRef.current && isConnected) {
      socketRef.current.emit('send_message', {
        user: currentUser,
        message: newMessage.trim()
      });
      setNewMessage('');
      
      socketRef.current.emit('typing_stop', { user: currentUser });
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing_start', { user: currentUser });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('typing_stop', { user: currentUser });
      }, 2000);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypingText = () => {
    const typingArray = Array.from(typingUsers);
    if (typingArray.length === 0) return '';
    if (typingArray.length === 1) return `${typingArray[0]} is typing...`;
    if (typingArray.length === 2) return `${typingArray[0]} and ${typingArray[1]} are typing...`;
    return `${typingArray.slice(0, -1).join(', ')} and ${typingArray[typingArray.length - 1]} are typing...`;
  };

  return (
    <div className="chat-dashboard">
      <div className="chat-header">
        <h1>Real-Time Chat Dashboard</h1>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢' : '🔴'}
          </span>
          <span>{varOcg.connectionStatus}</span>
          <span className="message-count">({varOcg.messageCount} messages)</span>
        </div>
      </div>

      <div className="messages-container">
        <div className="messages-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.user === currentUser ? 'own-message' : 'other-message'}`}
            >
              <div className="message-header">
                <span className="username">{msg.user}</span>
                <span className="timestamp">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="message-content">{msg.message}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {typingUsers.size > 0 && (
          <div className="typing-indicator">
            <span className="typing-text">{getTypingText()}</span>
            <span className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder={`Message as ${currentUser}...`}
            className="message-input"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="send-button"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <ChatDashboard />
    </div>
  );
}

export default App;