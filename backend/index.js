const express = require("express");
const app = express();
const cors = require('cors')
const server = require('http').Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid")
const ejs = require("ejs")
require('dotenv').config()

app.use(express.json())
app.use(cors())
//app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res)=>{
    res.redirect(`/${uuidV4()}`);
})

app.get("/:room", async (req, res)=>{
    res.send({ roomId: req.params.room });
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId)=>{
        //console.log(roomId, userId)
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', ()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(4000, async ()=>{
    console.log(`server is running at ${4000}`);
})