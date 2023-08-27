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
    
    socket.on('user_connected', (userId) => {
        console.log(userId, 'user id')
        if(!connectedUsers.some((user) => user.uid === userId)) {
            connectedUsers.push({
                uid: userId,
                socketId: socket.id
            })
        }
        
        console.log('Clients Connect', connectedUsers);
        io.emit('get-users', connectedUsers);
    });
    // socket.emit('test', {test: 'hello'})
    
    // eventEmitter.on('contract-create', (data) => {
    //     const user = usersService.getCustomerById(data.id_customer)
        
    //     if(user){
    //         socket.to(user.socket).emit('contract-create', data)
    //     }
    //     socket.emit('contract-create', data)

    // })

    socket.on('message', (data) => {
        // const {providerId, customerId} = data;
        // const userSocketId = connectedUsers[providerId || customerId]
        console.log(data);

        // io.to(data.conversationId).emit('message', data);
        // if(userSocketId) {
        //     io.to(userSocketId).emit('message', data)
        // }
        socket.broadcast.emit('message', data);
        // socket.emit('message', data);
    })

    socket.on("disconnect", () => {
        connectedUsers = connectedUsers.filter((user) => user.socketId !== socket.id);
        console.log('User disconnected', connectedUsers);
        io.emit('get-users', connectedUsers)
    })
})
