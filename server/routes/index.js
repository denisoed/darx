const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => {
    res.send("Routing express working!");
});

module.exports = routes;