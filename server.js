const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;

//instance serveur
const server = express();

//config body-parser
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//routes
server.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Bonjour sur mon super serveur</h1>');
});

server.use('/api/', apiRouter);

//launcher server
server.listen(8080, function() {
    console.log('Serveur lancé!');
});