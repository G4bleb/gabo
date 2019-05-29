var gabo = require('./gameserver')
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

//Deliver resources on request
app.use(express.static('public'));

//Deliver index.html on / request
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var games = {};//Associative array of games
const MAX_NUMBER_OF_GAMES = 2;

io.sockets.on('connection', function (socket) {
    console.log("Connection");

    //When a new player tries to connect
    socket.on('new_player', function (nickname, roomcode) {
        //Test the roomcode
        console.log(games[roomcode]);
        if (typeof (games[roomcode]) === 'undefined') {//If the room does not exist
            console.log("Current number of games : " + Object.keys(games).length);
            if (Object.keys(games).length < MAX_NUMBER_OF_GAMES) {//If the room can be created
                console.log("Creating a new game");
                games[roomcode] = new gabo.Game({})//Create an empty game
            } else {
                console.log("Can't create a new game");
                socket.disconnect();//Connection failed
                return false;
            }
        }
        socket.join(roomcode);//Also join socket.io room
        console.log(games);

        games[roomcode].players[socket.id] = new gabo.Player(nickname, new gabo.Hand([]));//Create the player
        if (typeof (games[roomcode].leaderId) === 'undefined') {//If the game has no leader (just created)
            games[roomcode].leaderId = socket.id;
            socket.emit('lead_given');//Give lead to the player
        }
        //Handle player disconnection (while the games has not started)
        socket.on('disconnect', function () {
            console.log("Disconnection : lost player " + socket.id + " (" + games[roomcode].players[socket.id].nickname + ")");
            socket.to(roomcode).emit('update', ["player_removed", socket.id]);//Notify clients of player leaving
            delete games[roomcode].players[socket.id];//Remove player from the game
            io.to(Object.keys(games[roomcode].players)[0]).emit('lead_given');//Give lead to the new first player of the game
            console.log(games[roomcode].players);
            if (Object.keys(games[roomcode].players).length === 0) {//If the game is now empty
                console.log("Deleting game " + roomcode);
                delete games[roomcode];//Delete it
            }
        });
        console.log(games[roomcode].players);

        socket.emit('initial_players', (games[roomcode].players));//Player created : emit to him the players currently here
        socket.to(roomcode).emit('update', ["player_added", socket.id, games[roomcode].players[socket.id]]);//Emit to every other player his presence
        
    });

    //Requests (client -> server)
    socket.on('request', function (request) {
        console.log("Request");
        console.log(request);
        
        var roomcode = Object.keys(socket.rooms)[1];
        //Handle request 
        switch (request[0]) {
            //start_game
            case "start_game":
                console.log("Starting game " + Object.keys(socket.rooms)[1]);
                games[roomcode].start();
                console.log("Game started");
                console.log(games[roomcode]);
                io.in(roomcode).emit('game_started');

                for (let playerId in games[roomcode].players) {
                    console.log("Emitting hand_update");
                    io.in(roomcode).emit('update', ["hand_update", playerId, games[roomcode].players[playerId].hand.cards.length]);
                    io.in(roomcode).emit('update', ["power_usable", "check_self"]);
                }

                //TODO Initial card check
                //TODO Player turns
                break;
            case "card_value":
                console.log("Got asked for " + request[1]);
                console.log("Player : " + request[1].match("^[a-zA-Z0-9_\-]+"));
                console.log("CardId : " + request[1].match("[0-9]+$"));
                let card = games[roomcode].players[request[1].match("^[a-zA-Z0-9_\-]+")].hand.cards[request[1].match("[0-9]+$")];
                socket.emit("card_check_response", [card.rank, card.suit])
                break;
            default:
                break;
        }
    });
});

server.listen(8080);//Start server