import { verify } from 'jsonwebtoken';
import { eventEmitter } from '../helpers/event-emitter.js'
import { io } from '../index.js'
import dotenv from 'dotenv'
import UsersService from './users-service.js'

dotenv.config({path: '.env'})

const usersService = new UsersService()

io.use((socket, next) => {
    const {token} = socket.handshake.auth

    if(!token){ 
        const err = new Error("Not authorized");
        err.data = {"error": "Token was not provided"};
        return next(err)
    }

    try {
        const profile = verify(token, process.env.JWT_SECRET);
        usersService.addUser({...profile, socket: socket.id});

        next()
    } catch(error){
        const err = new Error("Not authorized");
        err.data = {"error": "Token invalid", error};
        err.error = error;

        next(err)
    }
})


io.on('connection', (socket) => {
    socket.emit('test', {test: 'hello'})
    
    eventEmitter.on('contract-create', (data) => {
        const user = usersService.getCustomerById(data.id_customer)
        
        if(user){
            socket.to(user.socket).emit('contract-create', data)
        }
        socket.emit('contract-create', data)

    })

    socket.on("disconnect", () => {
        usersService.deleteUser(socket.id)
    })
})
