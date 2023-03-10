import React from 'react'

export default function ErrorBox({errBoxRef, errMsgRef, setBoxVisible}) {
  return (
    <div ref={errBoxRef} className="p-2 rounded-md shadow-mg flex justify-between items-center transition hidden"><span ref={errMsgRef}></span><button className="text-xs p-1 focus-visible:outline-none rounded-md hover:bg-gray-100/5 transition" onClick={() => setBoxVisible(false)}>Close</button></div>
  )
}
