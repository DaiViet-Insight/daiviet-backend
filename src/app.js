require('dotenv').config();
const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('dev'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const router = express.Router();
const userRoutes = require('./routes/user');

// CORS error handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // '*' for all
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); // '*' for all
        return res.status(200).json({});
    }
    next();
});
app.use('/', router);
app.use('/users', userRoutes);

router.get('/', (req, res, next) => {
    res.send('Server is running ...');
});

module.exports = app;