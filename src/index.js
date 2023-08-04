import app from './app.js';
import env from 'dotenv';
import http from 'http';
import {Server} from 'socket.io'
import { sequelize } from './database/database.js';

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
 
env.config();

// Models
import './models/Boat.js';
import './models/Category.js';
import './models/Contract.js';
import './models/Customer.js';
import './models/Person.js';
import './models/Portofolio.js';
import './models/Profile.js';
import './models/Provider.js';
import './models/Rating.js';
import './models/Role.js';
import './models/Service.js';
import './models/Schedule.js';
import './models/ServiceCategories.js';
import './models/ServicePreferences.js';
import './models/ServiceProviders.js';
import('./socket/socket.js')

const connect = async () => {
    try {
        // await sequelize.sync({alter: true})
        server.listen(app.get('port'))
        console.log(`listening on port ${app.get('port')}`);
    } catch (error) {
        console.log('Unable to connect', error);
    }
};

connect();