const {Server} = require("socket.io");
const http = require('http')
const express = require('express')
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
})
io.on('connection', (socket) => {
    console.log('a user connected'+socket.id);
    const userId = socket.handshake.query.userId
    if(userId !== undefined){
        userSocketMap[userId] = socket.id
    }
    console.log(userId)
    app.get('/getOnlineUsers', (req, res) => {
        return res.json({users:Object.keys(userSocketMap)})
    })
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
    socket.on('disconnect',()=>{
        console.log('userDisconnected', socket.id)
        delete userSocketMap[userId]
        console.log(userSocketMap)
            io.emit("getOnlineUsers", Object.keys(userSocketMap));

    })
})
const getReceiverSocketId = (receiverId)=>{
    console.log(receiverId,'fucking reciverid       ')
    console.log(userSocketMap[receiverId], "fucking reciverid");
    return userSocketMap[receiverId]
}
const userSocketMap = {};
const notifyUser = (userId, message) => {
  io.emit("notification", { userId, message });
};

const notifyMessage = (chatId, message) => {
  io.emit("chatMessage", { chatId, message });
};

module.exports = {
  notifyUser,
  notifyMessage,
  app,
  server,
  io,
  getReceiverSocketId,

};
