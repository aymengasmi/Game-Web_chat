// Initialise le serveur

// On va utiliser express pour la gestion "serveur classique"
var express = require('express')
var app = express()

// Configuration du server
require('./config')(app);

// Variables globales
GLOBAL.dico_room=new Array();

// On va utiliser socketio pour la gestion temps réel
var io = require('socket.io').listen(app.listen(3000));

//Gestion des routes
require('./routes')(app,io);

//Gestion des communication par socket
require('./socket')(io);


console.log("Le serveur a démarré et est branché sur le port 3000");
