import React, {useEffect, useRef, useState} from 'react'
import { Tooltip } from 'flowbite-react'
import Message from './modules/Message'

function Chat({socket, nickname, setNickname, roomTitle}) {
    const [messageList, setMessageList] = useState([])
    const [message, setMessage] = useState("")
    const inputRef = useRef()
    const msgEndRef = useRef()

    useEffect(() => {
        socket.on("newMessage", (data) => {
          setMessageList((list) => [...list, data])
        //   document.title = "New message!"
        //   const documentTitle = setTimeout(() => {
        //     document.title = "Real-time Chat App"
        //   }, 3000)
        //   return () => clearTimeout(documentTitle)
        })
    }, [socket]) 

    useEffect(() => {
        msgEndRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    }, [messageList])

    const handleSend = () => {
        if(message === ""){
            return inputRef.current.focus()
        }
        if(message.startsWith("/")){
            const string = message.split(" ")
            const command = string[0]
            const args = string.slice(1).join(" ")
            if(command === "/setnick"){
                setMessage("")
                inputRef.current.focus()
                if(args.length > 0 && args.length <= 15 && args.trim()) {
                    setNickname(args)
                    socket.emit("changeNick", args)
                    return setMessageList((list) => [...list, {type: "info", nickname:"Server", msg: `Nickname has been changed to ${args}.`}])
                }
                setMessage("")
                inputRef.current.focus()
                return setMessageList((list) => [...list, {type: "warning", nickname:"Server", msg: "Invalid nickname. (Should be longer than 0, shorter than 15 and shouldn't be empty.)"}])
            }
            if(command === "/clear"){
                setMessageList([])
                setMessage("")
                inputRef.current.focus()
                return setMessageList((list) => [...list, {type: "info", nickname:"Server", msg: "Chat has been cleared."}])
            }
            setMessage("")
            inputRef.current.focus()
            return setMessageList((list) => [...list, {type: "warning", nickname:"Server", msg: "Command does not exist."}])
        }
        if (message.length > 100) {
            setMessage("")
            inputRef.current.focus()
            return setMessageList((list) => [...list, {type: "warning", nickname:"Server", msg: "Only 100 characters is allowed."}])
        }
        setMessageList((list) => [...list, {type: message, uid: socket.id, msg: message}])
        socket.emit("sendMessage", message)
        setMessage("")
        inputRef.current.focus()
    }

    return (
        <div className='max-w-xl m-auto mt-16'>
            <div className='p-3 m-2 bg-gray-700 rounded-md border-[1px] border-gray-900 grid'>
                <div className='flex justify-between items-center rounded-t-md bg-gray-900/70 p-3 font-medium'>
                    <p>{roomTitle}</p>
                    <Tooltip content="Click to change your nickname!" placement="bottom" animation="duration-150" theme="bg-gray-400">
                        <button className='text-sm font-normal' onClick={() => setMessage("/setnick " + nickname)}>Typing as {nickname}</button>
                    </Tooltip>
                </div>
                <div className='bg-gray-800 grid overflow-auto max-h-96 overflow-x-hidden break-words break-all'>
                    {messageList.map((messageContent) => {
                        var classList = "p-2 transition mt-1 first:mt-0 "
                        switch (messageContent.type) {
                            case "join":
                                classList = classList + "bg-green-800 italic"
                                break;
                            case "leave":
                                classList = classList + "bg-red-800/60 italic"
                                break;
                            case "info":
                                classList = classList + "bg-teal-800 italic"
                                break;
                            case "warning":
                                classList = classList + "bg-amber-800 italic"
                                break;
                            case "sponsored":
                                classList = classList + "bg-gradient-to-r from-red-700 to-orange-500 italic"
                                break;
                            default:
                                classList = classList + "bg-gray-800 hover:bg-gray-900/50"
                                break;
                        }
                        return (<Message key={(Math.random() + 1).toString(36).substring(7)} messageContent={messageContent} classLists={classList} />)
                    })}
                    <div ref={msgEndRef} />
                </div>
                <div className='flex gap-2 p-2 bg-gray-800 rounded-b-md'>
                    <input maxLength="100" ref={inputRef} value={message} onChange={event => setMessage(event.target.value)} placeholder='Send a message...' className='grow p-1 pl-2 transition focus:ring-4 text text-black rounded-md focus-visible:outline-none' onKeyDown={(event) => {event.key === "Enter" && handleSend()}}/>
                    <button onClick={handleSend} className='p-2 transition bg-blue-600 rounded-md hover:bg-blue-700 focus-visible:outline-none focus:ring-4 focus:ring-blue-800'>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat