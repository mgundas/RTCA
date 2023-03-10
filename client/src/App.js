import React, { useState } from "react";
import io from "socket.io-client"
import Chat from "./components/Chat";
import Login from "./components/Login";

const socket = io.connect("http://192.168.1.200:3002")

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [roomData, setRoomData] = useState({})

  return !loggedIn ? (
    <Login socket={socket} setLoggedIn={setLoggedIn} setRoomData={setRoomData} />
  ) : (
    <Chat socket={socket}  nickname={roomData.nickname} setNickname={setRoomData} roomTitle={roomData.roomData.roomName} />
  )
}

export default App