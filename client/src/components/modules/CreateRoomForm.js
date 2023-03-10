import React, { useRef, useState } from 'react'
import axios from "axios"

export default function CreateRoomForm({socket, sendNotification}) {
    // States
    const [roomName, setRoomName] = useState("")
    const [roomPass, setRoomPass] = useState("")

    // Refs
    const roomPassRef = useRef()

    // Methods
    const handleSubmit = async () => {
        return axios
        .post(
            process.env.REACT_APP_REST_API_BASE_URL + "/room/new",
            {roomName: roomName, roomPass: roomPass},
            {"content-type": "application/json"}
        )
        .then(data => {
            if(data.data.success){
                return sendNotification({msg: `The room with the id ${data.data.roomid} has been created.`, type: "success", duration: 10000})
            }
            return sendNotification({msg: "Something went wrong.", type: "failure", duration: 3000})
        })
        .catch(err => {
            sendNotification({msg: err.message, type: "failure", duration: 3000})
        })
    }

    return (
    <div className='mt-5 grid gap-2'>
        <h1 className="flex items-center justify-center text-xl font-medium text-center mb-5">...or create a room, maybe?</h1>

        {/* Room name input */}
        <input
            className="p-2 focus-visible:outline-none focus:ring-4 transition text-black text-md rounded-md"
            placeholder="Room name"
            onKeyDown={(event) => {
                event.key === "Enter" && roomPassRef.current.focus();
            }}
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
        />

        {/* Room password input */}
        <input
            type="password"
            className="p-2 focus-visible:outline-none focus:ring-4  border-none focus:ring-blue-500/50 transition text-black text-md rounded-md"
            placeholder="Room password"
            ref={roomPassRef}
            onKeyDown={(event) => {
                event.key === "Enter" && handleSubmit()
            }}
            value={roomPass}
            onChange={(e) => setRoomPass(e.target.value)}
        />

        {/* Join button */}
        <button
            className="p-2 focus-visible:outline-none focus:ring-4 focus:ring-blue-800 transition bg-blue-700 rounded-md hover:bg-blue-800"
            onClick={handleSubmit}
        >
            Create Room
        </button>
    </div>
    )
}
