import React, { useEffect, useRef } from 'react'

export default function Notification({ data, notificationVisible, setNotificationVisible }) {
    // References
    const notificationRef = useRef()

    // Variables
    var bgColor = ""

    // Make the notification box visible or invisible depending on the state passed down
    useEffect(() => {
        if (notificationVisible) {
            notificationRef.current.classList.remove("hidden")
            var hideTimeout = window.setTimeout(() => {
                setNotificationVisible(false)
            }, data.duration)
            return
        }
        notificationRef.current.classList.add("hidden")
        return () => clearTimeout(hideTimeout)
    }, [notificationVisible, data.duration, setNotificationVisible])

    // Decide what the bg-color will be.
    switch (data.type) {
        case "success":
            bgColor = "bg-green-800/75"
            break;
        case "failure":
            bgColor = "bg-red-800/75"
            break;
        case "warning":
            bgColor = "bg-yellow-800/75"
            break;
        default:
            bgColor = "bg-teal-800/75"
            break;
    }

    return (
        <div 
            ref={notificationRef}
            className={"rounded-md p-2 flex justify-between items-center " + bgColor}
        >
            <span>
                {data.msg}
            </span>

            <button 
                className='p-1 text-sm hover:bg-black/10 rounded-md transition outline-none focus:bg-black/20' 
                onClick={() => setNotificationVisible(false)}
            >
                Close
            </button>
        </div>
    )
}
