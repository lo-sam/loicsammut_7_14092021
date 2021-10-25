const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/apiRouter');
const path = require('path');
const model = require('./models')
model.sequelize.sync()

//instance serveur
const server = express();

//config body-parser
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//routes
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


server.use('/images', express.static(path.join(__dirname, "images")));
server.use('/api', router);

//launcher server
server.listen(8080, function() {
    console.log('Serveur lancé!');
});