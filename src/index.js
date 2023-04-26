import app from './app.js';
import pkg from 'pg';

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

// const pool = new pkg.Pool({
//     connectionString: 'postgres://gfkzngutksumgg:61879c145effce3acc1ccb2fad7f25e3c3e8053953d59ad1a70dfbe24b007300@ec2-3-234-204-26.compute-1.amazonaws.com:5432/dbj4csnpe5otg5',
//     ssl: {
//         rejectUnauthorized: false
//     }
// })

// pool.connect((err) => {
//     if (err) {
//         console.log(err);
//         return;
//     } else {
//         console.log('Database is connected')
//     }
// })

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