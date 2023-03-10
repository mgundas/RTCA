import React from 'react'

export default function Message({messageContent, classLists}) {
  return (
    <div className={classLists}>
        <span className='font-medium'>{messageContent.nickname || "You"}</span>: {messageContent.msg}
    </div>
  )
}