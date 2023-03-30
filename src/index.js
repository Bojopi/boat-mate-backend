const express = require('express');
const morgan = require('morgan');

const roleRoutes = require('./routes/rol.routes');

const app = express();

app.use(morgan('dev'));

app.use(roleRoutes);


app.listen('4000')
console.log('listening on port 4000');