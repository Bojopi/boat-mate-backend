
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

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
import ratingRoutes from './routes/rating.routes.js';
import mediaRoutes from './routes/media.routes.js';
import profileRoutes from './routes/profile.routes.js';
import portofolioRoutes from './routes/portofolio.routes.js';

const apiRouter = express.Router();

const allowedOrigins = ['http://localhost:3000', 'https://boatmate-frontend.vercel.app', 'http://ec2-3-131-141-161.us-east-2.compute.amazonaws.com'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())


app.use((err, req, res, next) => {
    res.header('Access-Control-Allow-Origin', allowedOrigins);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.json({
        message: err.message
    });
});

//upload images
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './src/uploads'
}));

app.use('/api', apiRouter);

apiRouter.use(rolRoutes);
apiRouter.use(authRoutes);
apiRouter.use(userRoutes);
apiRouter.use(providerRoutes);
apiRouter.use(serviceRoutes);
apiRouter.use(categoryRoutes);
apiRouter.use(customerRoutes);
apiRouter.use(boatRoutes);
apiRouter.use(ratingRoutes);
apiRouter.use(mediaRoutes);
apiRouter.use(profileRoutes);
apiRouter.use(portofolioRoutes);



export default app;