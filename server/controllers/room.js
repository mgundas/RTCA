require("dotenv").config()
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const RoomModel = require("../models/Rooms")
const jwt = require("jsonwebtoken")

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET)
}

const getRoom = async (req, res) => {
  const {id, roomPass} = req.body
  const roomExists = await RoomModel.exists({roomid: id})
  if(roomExists){
    const room = await RoomModel.findOne({roomid: id})
    return bcrypt.compare(roomPass, room.password)
    .then(matches => {
      if(matches){
        return res.status(200).json({
          success: true,
          token: generateAccessToken
          ({
            roomName: room.roomname,
            roomId: room.roomid,
            createdAt: room.createdAt
          })
        })
      }
      return res.status(200).json({
        success: false,
        msg: "password.incorrect"
      })    
    })
    .catch(err => {
      return res.status(200).json({
        success: false,
        msg: err.message
      })
    })
  }
  return res.status(200).json({
    success: false,
    msg: "room.does.not.exist"
  })
}

const createRoom = async (req, res) => {
    const { roomName, roomPass } = req.body
    const randomid = "#" + crypto.randomBytes(3).toString("hex")
    if (roomName && roomPass){
      if (roomName.length > 1 && roomName.length <= 15 && roomName.trim()){
        if (roomPass.length > 8 && roomPass.length <= 30 && roomPass.trim()){
          const salt = await bcrypt.genSalt(12)
          return bcrypt.hash(roomPass, salt)
          .then(async (hash) => {
            try {
              const room = await RoomModel.create({
                roomid: randomid,
                roomname: roomName,
                password: hash,
              })
              return room.save()
              .then(data => {
                return res.json({success: true, roomid:data.roomid})
              })
              .catch(error => {
                return res.json({success: false, message: error.message})
              })
            } catch (error) {
              return res.json({success: false, message: error.message})
            }
          })
          .catch(error => {
            return res.json({success: false, message: error.message})
          })
        }
        return res.json({success: false, message: "roompass.requirements.are.not.met"})
      }
      return res.json({success: false, message: "roomname.requirements.are.not.met"})
    }
    return res.json({success: false, message: "necessary.parameters.not.provided"})
}

module.exports = {
    getRoom,
    createRoom
}