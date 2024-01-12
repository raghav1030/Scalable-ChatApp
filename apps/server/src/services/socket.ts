import { Server } from "socket.io";
import { Redis } from "ioredis";

const pub = new Redis({
    host: "redis-3c6a624b-socketio-chat-app.a.aivencloud.com",
    port : 18761,
    username : "default",
    password : "AVNS_u7oqDQAziFH6VNIAqe8"
})
const sub = new Redis({
    host: "redis-3c6a624b-socketio-chat-app.a.aivencloud.com",
    port : 18761,
    username : "default",
    password : "AVNS_u7oqDQAziFH6VNIAqe8"
})
class SocketService {
    private _io : Server

    constructor(){
        console.log("Init Socket Server")
        this._io = new Server({
            cors:{
                allowedHeaders: ["*"],
                origin: "*",
                // methods: ["GET", "POST"],
            }
        });

        sub.subscribe("MESSAGES")
    }

    get io(){
        return this._io
    }

    public initListners(){
        const io = this._io
        console.log("init Socket Listners...")
        io.on("connect" , async(socket) =>{
            console.log("New Socket Connected" , socket.id)
            socket.on("event:message" , async({message} : {message : string}) =>{
                console.log("new message recieved" , message)
                await pub.publish("MESSAGES" , JSON.stringify(message))
            })
        })

        sub.on("message" , (channel , message) =>{
            
            if(channel === "MESSAGES"){
                io.emit("new-message" , message)
                console.log("new message in channel from redis" , channel , message)
            }

        })
        
    }
}

export default SocketService