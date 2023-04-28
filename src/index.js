import app from './app.js';

import env from 'dotenv';

env.config();

import { sequelize } from './database/database.js';

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

const connect = async () => {
    try {
        // await sequelize.sync({force: true})
        app.listen(app.get('port'))
        console.log('listening on port 8080');
    } catch (error) {
        console.log('Unable to connect', error);
    }
};

connect();