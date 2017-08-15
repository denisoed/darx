const express = require('express');
const app = express();
const path = require('path');
const config = require('./config/database');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
  if(err) {
    console.log('Could not connect to datbase: ', err);
  }else {
    console.log("Connect to database: ", config.db);
  }
});

app.get('/', (req, res) => {
  res.send('Hello men');
});

app.listen(3000, () => {
  console.log("Server working!");
});