import app from './app.js';

import { sequelize } from './database/database.js';

// Models
import './models/Role.js';
import './models/Boat.js';
import './models/Customer.js';
import './models/Person.js';
import './models/Profile.js';
import './models/Provider.js';
import './models/Service.js';
import './models/Schedule.js';


const connect = async () => {
    try {
        await sequelize.sync({alter: true})
        app.listen('8080');
        console.log('listening on port 8080');
    } catch (error) {
        console.log('Unable to connect', error);
    }
};

connect();