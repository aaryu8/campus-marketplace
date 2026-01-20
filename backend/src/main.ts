import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import marketplaceRoutes from './routes/marketplace.js';
import { handleChatSockets } from './ws/chat.js'; 
import chatWork from './chat/chatWork.js';
dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/chat' , chatWork);


// ✅ WebSocket / Chat
const io = new SocketIOServer(server, {
    cors: { origin: 'http://localhost:3000', credentials: true }
});
handleChatSockets(io); // plug in your chat logic here

// ✅ Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
