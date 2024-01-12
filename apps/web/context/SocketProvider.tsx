"use client"
import React, { createContext, useCallback, useEffect, useContext, useState } from 'react'
import { Socket, io } from 'socket.io-client'

interface SocketProviderProps {
    children: React.ReactNode
    
}

interface ISocketContext {
    sendMessage : (msg : string) => any,
    messages : string[]

}

const SocketContext = createContext<ISocketContext | null>(null)

export const useSocket = () => {
    const state = useContext(SocketContext)
    
    if(!state){
        throw new Error("State is undefined")
    }
    return state
}

const SocketProvider : React.FC<SocketProviderProps> = ({children}) => {

    const [socket , setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<string[]>([])
    const sendMessage : ISocketContext["sendMessage"] = useCallback((msg) =>{
        console.log("Send Message" , msg)
        if(socket){
            console.log("sending message ...")
            socket.emit("event:message", {message : msg})
        }
    },[socket])

    const onMessageRecieved = useCallback( (msg : string) => {
        console.log("Message Recieved from server" , msg)
        console.log(typeof msg)
        const message = JSON.parse(msg) 
        console.log(typeof message)
        setMessages((prev) => [...prev , message])
    },[])

    useEffect(() =>{
        const _socket = io("http://localhost:9000")
        setSocket(_socket)
        _socket.on("new-message" , onMessageRecieved)
        // _socket.connect()
        return () =>{
            _socket.disconnect()
            _socket.off("new-message" , onMessageRecieved)
            setSocket(undefined)
        }

    },[])

  return (
    <SocketContext.Provider value={{sendMessage , messages}}>
        {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
