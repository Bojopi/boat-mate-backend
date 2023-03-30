const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const roleRoutes = require('./routes/rol.routes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(roleRoutes);

app.use((err, req, res, next) => {
    return res.json({
        message: err.message
    })
});


app.listen('8080')
console.log('listening on port 8080');