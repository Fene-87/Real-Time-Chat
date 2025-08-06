# Real-Time Chat Dashboard 💬

A modern real-time chat application built with React.js frontend and Node.js/Express backend using Socket.io for WebSocket communication.

## 🚀 Features

- **Real-time messaging** with Socket.io WebSockets
- **Typing indicators** showing when users are typing
- **Message history** with persistent storage during session
- **Responsive design** with modern UI/UX
- **Auto-scrolling** message list
- **Connection status** indicator
- **Simulated chat activity** for demo purposes

## 🛠️ Tech Stack

### Frontend
- React.js 18.2+
- Socket.io-client for WebSocket connections
- Modern CSS with animations and responsive design

### Backend  
- Node.js with Express.js
- Socket.io for real-time communication
- CORS enabled for cross-origin requests

## ⚡ Quick Start (After Cloning)

### Prerequisites
- Node.js (v14+ recommended)
- npm package manager

### 📁 Project Structure
```
chat-dashboard/
├── backend/          # Node.js/Express server
│   ├── server.js
│   ├── package.json
│   └── .gitignore
└── frontend/         # React.js application
    ├── src/
    ├── public/
    ├── package.json
    └── .gitignore
```

### 🔧 Setup Instructions

**1. Clone and navigate to the project:**
```bash
git clone https://github.com/Fene-87/Real-Time-Chat.git
cd chat-dashboard
```

**2. Install Backend Dependencies:**
```bash
cd backend
npm install
```

**3. Install Frontend Dependencies:**
```bash
cd ../frontend
npm install
```

**4. Start the Backend Server:**
```bash
cd ../backend
npm run dev
```
✅ Backend will run on `http://localhost:5000`

**5. Start the Frontend (in a new terminal):**
```bash
cd frontend
npm start
```
✅ Frontend will open automatically at `http://localhost:3000`

## 🧪 Testing the Application

### ✅ Verify Setup
1. **Check both servers are running:**
   - Backend: `http://localhost:5000` (you should see "Cannot GET /" - this is normal)
   - Frontend: `http://localhost:3000` (chat interface should load)

2. **Test basic functionality:**
   - Type a message and hit "Send"
   - Watch for the connection status (🟢 connected)
   - Observe simulated messages from Alice, Bob, Charlie, and Diana

### 🔄 Test Real-time Features

**Multiple Users Simulation:**
- Open multiple browser tabs to `http://localhost:3000`
- Send messages from one tab → see them appear instantly in others
- Start typing in one tab → observe typing indicators in other tabs

**Automatic Features:**
- Watch for auto-generated messages every 5-10 seconds
- Typing indicators appear randomly from simulated users
- Messages auto-scroll to the bottom

### 🐛 Troubleshooting

**Backend won't start:**
```bash
cd backend
npm install --force  # Force reinstall if needed
npm run dev
```

**Frontend won't start:**
```bash
cd frontend  
npm install --legacy-peer-deps  # If dependency conflicts
npm start
```

**WebSocket connection issues:**
- Make sure backend is running on port 5000
- Check browser console for connection errors
- Verify no firewall is blocking localhost connections

## 📡 API Documentation

### REST Endpoints
- `GET /api/messages` - Returns the 5 most recent messages

### WebSocket Events
| Event | Description |
|-------|-------------|
| `connection` | New client connects |
| `send_message` | Client sends a message |
| `new_message` | Server broadcasts new message |
| `typing_start/stop` | Handle typing indicators |
| `user_typing` | Broadcast typing status |
| `initial_messages` | Send history to new connections |

## 💻 Development Commands

### Backend Commands
```bash
cd backend
npm run dev     # Start with auto-reload (recommended)
npm start       # Start in production mode
```

### Frontend Commands  
```bash
cd frontend
npm start       # Development server with hot reload
npm run build   # Create production build
npm test        # Run tests
```

## 🎨 Customization

### Adding New Features
- **Backend:** Edit `backend/server.js` to add new Socket.io events or API endpoints
- **Frontend:** Modify `frontend/src/App.js` for UI changes or new functionality
- **Styling:** Update `frontend/src/App.css` for visual customizations

### Environment Variables
Create `.env` files if needed:
```bash
# backend/.env
PORT=5000
NODE_ENV=development

# frontend/.env  
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🚀 Production Deployment

### Build for Production
```bash
# Build frontend
cd frontend
npm run build

# The build folder contains optimized static files
```

### Deployment Checklist
- [ ] Update Socket.io connection URL to production backend
- [ ] Configure CORS for production domain
- [ ] Set environment variables (PORT, NODE_ENV)
- [ ] Use PM2 or similar for process management
- [ ] Set up reverse proxy (nginx) if needed

## 📝 Technical Assessment Notes

This project includes the required technical assessment elements:
- ✅ **Keyword:** `__define-ocg__` appears in code comments
- ✅ **Variable:** `varOcg` used for state management
- ✅ **Real-time chat** with WebSocket implementation
- ✅ **Modern stack** (React + Node.js + Express)
- ✅ **Professional UI/UX** with animations and responsive design

## 🤝 Contributing & Next Steps

For production enhancement, consider adding:
- User authentication and authorization
- Message persistence with database (MongoDB/PostgreSQL)
- File upload and image sharing
- Message reactions and threads  
- Rate limiting and input validation
- Unit and integration tests
- Docker containerization

---

## 📧 Support

If you encounter issues:
1. Check that both servers are running
2. Verify Node.js version (v14+)  
3. Clear npm cache: `npm cache clean --force`
4. Check browser console for errors

**Built with ❤️ for APHRC Technical Assessment**