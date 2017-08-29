const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const config = require('./config/database');
const index = require('./server/routes/index');
const authentication = require('./server/routes/authentication');
const post = require('./server/routes/post');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Could not connect to database: ', err);
    } else {
        console.log("Connect to database:", config.db);
    }
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(express.static(__dirname + '/client/dist/'))

app.use('/', index);
app.use('/authentication', authentication);
app.use('/post', post);

app.listen(3000, () => {
    console.log("Server working on port: 3000");
});