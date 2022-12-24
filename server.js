const express = require('express');
const path = require('path');
const app = express();
const router = express.Router()
const http = require('http');
const server = http.createServer(app);
const {userJoin, removeUser} = require('./utils/users')
const socketio = require('socket.io');
const io = socketio(server);
app.use(express.static(path.join(__dirname,'public')))


io.on('connection', (socket) => {
  socket.emit('helpMe')
  socket.emit('message',"Server Here")
  socket.on('joinRoom', ({roomName})=>{
    socket.emit('message',"Join Room Here")
    const {user,overpowered, notSelected} = userJoin(socket.id, roomName)
    
    if(user == undefined){
      socket.emit('message', "Room Is Full Bro")
      socket.emit('whatToDo')
    }
    if(user != undefined && user != 0){
    socket.join(user.roomName)
  
    socket.on('playMove',(data)=>{
      socket.broadcast.to(user.roomName).emit('markPos',data)
    })

    socket.on('send-chat-message',(message, userNAME)=>{
      socket.broadcast.to(user.roomName).emit('requestedMessage', message,userNAME)
    })

    socket.to(overpowered).emit('firstTurn',notSelected)

    socket.on('next', notSelected=>{
      socket.to(notSelected).emit('secondTurn')
    })

    socket.on('resetOnlineGame', ()=>{
      io.to(user.roomName).emit('resetOnDis')
    })

    // socket.to(notSelected).emit('secondTurn',overpowered)

    socket.on("disconnect",()=>{
      removeUser(socket.id)
      socket.broadcast.to(user.roomName).emit('resetOnDis')
    })

    socket.on("replay",()=>{
      socket.broadcast.emit("requestReplay")
    })
  }
  })
  
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));