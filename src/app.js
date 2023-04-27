import env from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

env.config();
const app = express();

//settings
app.set('port', process.env.PORT || 8080)

//routes
import rolRoutes from './routes/rol.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import providerRoutes from './routes/provider.routes.js';
import serviceRoutes from './routes/service.routes.js';
import categoryRoutes from './routes/category.routes.js';
import customerRoutes from './routes/customer.routes.js';
import boatRoutes from './routes/boat.routes.js';

const allowedOrigins = ['http://localhost:3000', 'https://boatmate-frontend.vercel.app'];

const corsOptions = {
    origin: function(origin, callback) {
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true)
    },
    credentials: true
}

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())


app.use((err, req, res, next) => {
    res.header('Access-Control-Allow-Origin', allowedOrigins);
    return res.json({
        message: err.message
    });
});

app.use(rolRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(providerRoutes);
app.use(serviceRoutes);
app.use(categoryRoutes);
app.use(customerRoutes);
app.use(boatRoutes);



export default app;