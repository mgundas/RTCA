const mongoose = require("mongoose")

const RoomSchema = new mongoose.Schema({
    roomid: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: v => v.startsWith("#"),
            message: props => `${props.value} does not start with "#"`
        }
    },
    roomname: {
        type: String,
        required: true,
        min: 1,
        max: 15
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
})

module.exports = mongoose.model("rooms", RoomSchema)