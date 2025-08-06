// Real-time Chat Dashboard Backend - __define-ocg__
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Sample messages data
let messages = [
  { "id": 1, "user": "Alice", "message": "Hey team, morning!", "timestamp": "2025-07-29T08:01:00Z" },
  { "id": 2, "user": "Bob", "message": "Morning Alice!", "timestamp": "2025-07-29T08:01:15Z" },
  { "id": 3, "user": "Charlie", "message": "Anyone up for lunch later?", "timestamp": "2025-07-29T08:02:00Z" },
  { "id": 4, "user": "Alice", "message": "Count me in.", "timestamp": "2025-07-29T08:02:10Z" },
  { "id": 5, "user": "Bob", "message": "Same here!", "timestamp": "2025-07-29T08:02:20Z" }
];

let varOcg = { typingUsers: new Set(), messageIdCounter: 6 };

// API endpoint to get recent messages
app.get('/api/messages', (req, res) => {
  // Return the 5 most recent messages
  const recentMessages = messages.slice(-5);
  res.json(recentMessages);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send initial messages to new connection
  socket.emit('initial_messages', messages.slice(-5));

  // Handle new message from client
  socket.on('send_message', (data) => {
    const newMessage = {
      id: varOcg.messageIdCounter++,
      user: data.user,
      message: data.message,
      timestamp: new Date().toISOString()
    };
    
    messages.push(newMessage);
    
    // Keep only last 10 messages in memory
    if (messages.length > 10) {
      messages = messages.slice(-10);
    }
    
    // Broadcast new message to all clients
    io.emit('new_message', newMessage);
  });

  // Handle typing indicator
  socket.on('typing_start', (data) => {
    varOcg.typingUsers.add(data.user);
    socket.broadcast.emit('user_typing', { user: data.user, typing: true });
  });

  socket.on('typing_stop', (data) => {
    varOcg.typingUsers.delete(data.user);
    socket.broadcast.emit('user_typing', { user: data.user, typing: false });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Simulate random typing indicators and messages
const simulateActivity = () => {
  const users = ['Alice', 'Bob', 'Charlie', 'Diana'];
  const randomUser = users[Math.floor(Math.random() * users.length)];
  
  if (Math.random() > 0.7) {
    // Simulate typing
    io.emit('user_typing', { user: randomUser, typing: true });
    
    setTimeout(() => {
      io.emit('user_typing', { user: randomUser, typing: false });
      
      // Sometimes send a message after typing
      if (Math.random() > 0.5) {
        const randomMessages = [
          "Working on the new feature!",
          "Almost done with my tasks",
          "Anyone need help with anything?",
          "Great work everyone!",
          "Let's sync up later",
          "Coffee break time? ☕"
        ];
        
        const newMessage = {
          id: varOcg.messageIdCounter++,
          user: randomUser,
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date().toISOString()
        };
        
        messages.push(newMessage);
        if (messages.length > 10) {
          messages = messages.slice(-10);
        }
        
        io.emit('new_message', newMessage);
      }
    }, 1000 + Math.random() * 3000);
  }
};

setInterval(simulateActivity, 5000 + Math.random() * 5000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}`);
});