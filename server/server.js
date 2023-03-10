require("dotenv").config()
const { createServer } = require("http")
const { Server } = require("socket.io")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
var {users, rooms} = require("./data/scuffedDatabase")
const bcrypt = require("bcrypt")

// Router imports
const roomRouter = require("./routes/room")

// Middleware imports
const setCache = require("./middleware/setCache")
const notFound = require("./middleware/notFound")

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("DB connection successful."))
.catch(err => console.log(err))

const cor = {
  cors: {
    origin: `${process.env.CORS_ORIGIN}`, 
    methods: ["GET", "POST"] 
  }
}

// What even is this abomination
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, cor)

// Middleware
app.use(cors(cor))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
// app.use(express.static("./static"))
app.use(setCache)

// Routers
app.use("/room", roomRouter)
app.use("*", notFound)

const sponsoredMessageConfig = {
  nameShown: "RTCA",
  message: "Try out the pro version! Claim your 1-month free subscription.",
  interval: (1000 * 60 * 5), // milliseconds
}

const announcementConfig = {
  nameShown: "Server",
  message: "Please maintain a safe and secure environment. Don't forget to read the rules.",
  interval: (1000 * 60 * 3), // milliseconds
}

io.on("connection", socket => {
  socket.on("joinRoom", (data) => {
    users = [...users, {id: socket.id, nickname: data.nickname, room: data.roomId}]
    socket.join(data.roomId)
    const user = users.find(user => user.id == socket.id)
    io.to(data.roomId).emit("newMessage", {type: "join", nickname: "Server", msg: `${user.nickname} joined the room.`})
  })

  socket.on("sendMessage", data => {
    const user = users.find(user => user.id == socket.id)
    socket.to(user.room).emit("newMessage", {type: "message", uid: socket.id, nickname: user.nickname, msg: data})
  })

  socket.on("changeNick", newNick => {
    const user = users.find(user => user.id == socket.id)
    const oldNick = user.nickname
    user.nickname = newNick
    socket.to(user.room).emit("newMessage", {type: "info", nickname: "Server", uid: socket.id, msg: `${oldNick} has changed their name to ${newNick}.`})
  })

  socket.on("disconnect", () => {
    const user = users.find(user => user.id == socket.id)
    if(user){
        socket.to(user.room).emit("newMessage", {type: "leave", nickname: "Server", uid: socket.id, msg: `${user.nickname} left the room.`})
    }
  })
});

setInterval(() => {
  io.emit("newMessage", {type: "sponsored", nickname: sponsoredMessageConfig.nameShown, msg: sponsoredMessageConfig.message})
}, sponsoredMessageConfig.interval)

setInterval(() => {
  io.emit("newMessage", {type: "info", nickname: announcementConfig.nameShown, msg: announcementConfig.message})
}, announcementConfig.interval)

httpServer.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}...`))