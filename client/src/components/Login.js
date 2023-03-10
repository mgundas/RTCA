import React, { useState } from 'react'
import CreateRoomForm from "./modules/CreateRoomForm";
// import axios from "axios";
import LoginForm from "./modules/LoginForm";
import Notification from './modules/Notification'

/* const ACTIONS = {
    setNickname: "set-nickname",
    setRoomID: "set-room-id",
    setRoomPass: "set-room-pass",
    setFormData: "set-form-data"
}

function reducer(formData, action){
    switch (action.type) {
        case ACTIONS.setNickname:
            return formData.nickname = action.payload.nickname
        case ACTIONS.setRoomID:
            return formData.roomid = action.payload.roomid
        case ACTIONS.setRoomPass:
            return formData.roompass = action.payload.roompass
        case ACTIONS.setFormData:
            return formData = action.payload
        default:
            return
    }
} */

export default function Login({socket, setLoggedIn, setRoomData}) {
    // const [formData, dispatch] = useReducer(reducer, {})
    const [notificationVisible, setNotificationVisible] = useState(false)
    const [notificationProperties, setNotificationProperties] = useState({})
    
    const sendNotification = (data) => {
        setNotificationProperties({msg: data.msg, type: data.type, duration: data.duration})
        setNotificationVisible(true)
    }

    return (
        <div className="grid gap-3 max-w-md m-auto p-6 mt-5">
          <h1 className="flex items-center justify-center text-3xl font-medium text-center">Welcome to the real-time chat!</h1>

          <LoginForm socket={socket} setLoggedIn={setLoggedIn} setRoomData={setRoomData} sendNotification={sendNotification} />

          <CreateRoomForm socket={socket} sendNotification={sendNotification} />

          <Notification data={notificationProperties} notificationVisible={notificationVisible} setNotificationVisible={setNotificationVisible}  />
        </div>
    )
}
