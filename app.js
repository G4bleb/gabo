var gabo = require('./gameserver')
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
    
app.use(express.static('public'));

// Chargement de la page index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var games = {};
const MAX_NUMBER_OF_GAMES = 2;

io.sockets.on('connection', function (socket) {
    console.log("Connection");
    
    //Lorsqu'un nouveau joueur tente de se connecter
    socket.on('new_player', function (nickname, logincode) {
        //Test du code de connexion
        console.log(games[logincode]);
        if (typeof(games[logincode]) === 'undefined') {
            console.log(Object.keys(games).length);
            
            if (Object.keys(games).length < MAX_NUMBER_OF_GAMES) {
                console.log("Creating a new game");
                
                games[logincode] = new gabo.Game({})
            }else{
                console.log("Can't create a new game");
                socket.disconnect();
                return false;
            }
        }
        console.log(games);
        
        games[logincode].players[socket.id] = new gabo.Player(nickname, new gabo.Hand([]));
        console.log("New Player : " + games[logincode].players[socket.id].nickname);

        //Gérer la déconnexion
        socket.on('disconnect', function () {
            console.log("Disconnection, lost player");
            socket.broadcast.emit('update', ["player_removed", socket.id]);
            delete games[logincode].players[socket.id];
            console.log(games[logincode].players);
            if (Object.keys(games[logincode].players).length == 0) {
                console.log("Deleting game " + logincode);
                delete games[logincode];
            }
        });
        console.log(games[logincode].players);
        
        socket.emit('initial_players', (games[logincode].players));
        socket.broadcast.emit('update', ["player_added", nickname]);

    });


    socket.on('request', function (request, data) {
        console.log("Request");
        //Traiter la requête
        switch (request) {
            case "start_game":
                gabo.start();

                break;
        
            default:
                break;
        }
    });
});

server.listen(8080);