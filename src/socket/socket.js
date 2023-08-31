import { verify } from 'jsonwebtoken';
import { eventEmitter } from '../helpers/event-emitter.js'
import { io } from '../index.js'
import dotenv from 'dotenv'
import UsersService from './users-service.js'

dotenv.config({path: '.env'})

const usersService = new UsersService();

let connectedUsers = [];

// io.use((socket, next) => {
//     const {token} = socket.handshake.auth

//     if(!token){ 
//         const err = new Error("Not authorized");
//         err.data = {"error": "Token was not provided"};
//         return next(err)
//     }

//     try {
//         const profile = verify(token, process.env.JWT_SECRET);
//         usersService.addUser({...profile, socket: socket.id});

//         next()
//     } catch(error){
//         const err = new Error("Not authorized");
//         err.data = {"error": "Token invalid", error};
//         err.error = error;

//         next(err)
//     }
// })


io.on('connection', (socket) => {

    socket.on('join-room', ({userId, roomId}) => {
        const user = usersService.joinUserToChat(socket.id, userId, roomId);
        console.log('user joined', user)
        socket.join(user.roomId);
    })

    socket.on('message', (data) => {
        const user = usersService.getCurrentUser(socket.id);
        console.log('message sent', user)
        io.to(user.roomId).emit('message', {data, roomId: user.roomId});
    })

    socket.on("disconnect-room", () => {
        const user = usersService.disconnectUser(socket.id);

        if(user) {
            console.log('User disconnected', user);
        }
    })
})
