const express = require("express")
const { getRoom, createRoom } = require("../controllers/room")

const router = express.Router()

router.post("/", getRoom)
router.post("/new", createRoom)

module.exports = router