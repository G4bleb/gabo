var app = require('express')(),
    express = require('express'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
    
app.use(express.static('public'));

// Chargement de la page index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var players = [];
io.sockets.on('connection', function (socket) {
    console.log("Connection");
    
    //Lorsqu'un nouveau joueur tente de se connecter
    socket.on('new_player', function (nickname, logincode) {
        //TODO Tester un code généré auparavant
        //Si le code est mauvais
        if(logincode != "AAAA"){
            console.log("Wrong code");
            socket.disconnect();
            return false;
        }
        console.log("New Player");

        players.push(nickname);

        //Gérer la déconnexion
        socket.on('disconnect', function () {
            console.log("Disconnection, lost player");
            socket.broadcast.emit('update', ["player_removed", nickname]);
            players.splice(players.indexOf(socket.nickname), 1);
            console.log(players);
        })
        console.log(players);
        
        socket.emit('initial_players', players);
        socket.broadcast.emit('update', ["player_added", nickname]);

    });


    socket.on('request', function (request, data) {
        console.log("Request");
        //Traiter la requête
    });
});

server.listen(8080);