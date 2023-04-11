import env from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

env.config();
const app = express();

//settings
app.set('port', process.env.PORT || 8080)

//routes
import rolRoutes from './routes/rol.routes.js';
import authRoutes from './routes/auth.routes.js';

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use((err, req, res, next) => {
    return res.json({
        message: err.message
    });
});

app.use(rolRoutes);
app.use(authRoutes);



export default app;