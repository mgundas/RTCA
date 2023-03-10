import React, { useState, useRef } from 'react'
import axios from "axios"
import { decodeToken } from "react-jwt";

export default function LoginForm({ setLoggedIn, setRoomData, socket, sendNotification }) {
    // States
    const [loginNickname, setLoginNickname] = useState("")
    const [loginRoomID, setLoginRoomID] = useState("")
    const [loginRoomPass, setLoginRoomPass] = useState("")

    // References
    const loginRoomIDRef = useRef()
    const loginRoomPassRef = useRef()

    const handleSubmit = () => {
        if(loginNickname && loginNickname.length >= 3 && loginNickname.length <= 15 && loginNickname.trim()){
            setLoginNickname(loginNickname => loginNickname = loginNickname.trim())
            if(loginRoomID && loginRoomID.startsWith("#") && loginRoomID.length >= 5 && loginRoomID.length <= 8 && loginRoomID.trim()){
                setLoginRoomID(loginRoomID => loginRoomID = loginRoomID.trim())
                const requestConfig = {
                    headers: {
                        // "Authorization": `Bearer ${process.env.REACT_APP_REST_API_SECRET}`,
                        "Content-type": "application/json"
                    }
                }
                return axios
                .post(
                    process.env.REACT_APP_REST_API_BASE_URL + "/room",
                    {id: loginRoomID, roomPass: loginRoomPass},
                    requestConfig
                )
                .then(data => {
                    if(!data.data.success){
                        var errMsg = ""
                        switch (data.data.msg) {
                            case "room.password.incorrect":
                                errMsg = "Incorrect password. Please try again."
                                break;
                            case "room.does.not.exist":
                                errMsg = "Room does not exist."
                                break;
                            default:
                                errMsg = "Something went wrong."
                                break;
                        }
                        return sendNotification({msg: errMsg, type: "failure", duration: 3000})
                    }
                    const decodedToken = decodeToken(data.data.token);
                    setRoomData({
                        nickname: loginNickname,
                        roomData: decodedToken
                    })
                    localStorage.setItem("RTCA-nickname", loginNickname)
                    localStorage.setItem("RTCA-token", data.data.token)
                    socket.emit("joinRoom", {nickname: loginNickname, room: decodedToken.id})
                    return setLoggedIn(true)
                })
                .catch(err => {
                    return sendNotification({msg: "Something went wrong." + err.message, type: "failure", duration: 3000})
                })
            }
            return sendNotification({msg: "Room ID requirements aren't met.", type: "failure", duration: 3000})
        }
        sendNotification({msg: "Nickname requirements aren't met.", type: "failure", duration: 3000})
    }

    return (
        <div className="grid gap-2 mt-5">
            <h1 className="flex items-center justify-center text-xl font-medium text-center mb-5">Join a room</h1>

            {/* Nickname input */}
            <input
                className="p-2 focus-visible:outline-none focus:ring-4 transition text-black text-md rounded-md"
                placeholder="Nickname"
                onKeyDown={(event) => {
                    event.key === "Enter" && loginRoomIDRef.current.focus();
                }}
                value={loginNickname}
                onChange={(e) => setLoginNickname(e.target.value)}
            />

            {/* Room ID input */}
            <input
                className="p-2 focus-visible:outline-none focus:ring-4 transition text-black text-md rounded-md"
                placeholder="Room ID"
                ref={loginRoomIDRef}
                onKeyDown={(event) => {
                    event.key === "Enter" && loginRoomPassRef.current.focus();
                }}
                value={loginRoomID}
                onChange={(e) => setLoginRoomID(e.target.value)}
            />

            {/* Room Password input */}
            <input
                type="password"
                className="p-2 focus-visible:outline-none focus:ring-4 border-none focus:ring-blue-500/50 transition text-black text-md rounded-md"
                placeholder="Room password"
                ref={loginRoomPassRef}
                onKeyDown={(event) => {
                    event.key === "Enter" && handleSubmit()
                }}
                value={loginRoomPass}
                onChange={(e) => setLoginRoomPass(e.target.value)}
            />

            {/* Join button */}
            <button
                className="p-2 focus-visible:outline-none focus:ring-4 focus:ring-blue-800 transition bg-blue-700 rounded-md hover:bg-blue-800"
                onClick={handleSubmit}
            >
                Join
            </button>

            {/* 
            <button onClick={() => sendNotification({msg: "Success Test", type: "success", duration: 3000})}>Success Test</button>

            <button onClick={() => sendNotification({msg: "Failure Test", type: "failure", duration: 3000})}>Failure Test</button>

            <button onClick={() => sendNotification({msg: "Warning Test", type: "warning", duration: 3000})}>Warning Test</button>

            <button onClick={() => sendNotification({msg: "Default Test", duration: 3000})}>Default Test</button> */}

        </div>
    )
}
