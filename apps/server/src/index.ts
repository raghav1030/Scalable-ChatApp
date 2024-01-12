import http from 'http'
import SocketService from './services/socket'

const init = async () => {
    const socketService = new SocketService()
    const server = http.createServer()
    const PORT = process.env.PORT || 9000
    socketService.io.attach(server)

    server.listen(PORT , () =>{
        console.log("Server is up & running on port " , PORT)
    }) 
    socketService.initListners()
}

init()