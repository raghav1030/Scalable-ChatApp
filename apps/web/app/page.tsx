"use client"

import React, { useState } from 'react'
import classes from '../app/page.module.css'
import { useSocket } from '../context/SocketProvider'

const page = () => {
  const {sendMessage, messages} = useSocket()
  const [message , setMessage] = useState("")
  return (
    <div>
      <div>
        <h1>All Messages</h1>
        {
          messages.map((message,index) =>{
            return <p key={index}>
              {index+1} : {message}
            </p>
          })
        }
      </div>  

      <div className={classes["chat-action-container"]}>
        <input onChange={e => {setMessage(e.target.value)}} className={classes["chat-input"]}  type="text" />
        <button onClick={() => sendMessage(message)}  className={classes.button } >Send</button>
      </div>
    </div>
  )
}

export default page