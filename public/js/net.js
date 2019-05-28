var socket;
$('#login-form').submit(function (e) {
    e.preventDefault();
    //Get all the inputs into an array.
    var inputs = $('#login-form :input');
    //Get the values of the inputs
    var values = [];
    values['nickname'] = inputs[0].value;
    values['logincode'] = inputs[1].value;

    document.title = values['logincode'] + ' - ' + values['nickname'];//Set dynamic window title

    //Socket creation
    socket = io.connect('http://localhost:8080');

    //Reset input appearance
    $('input[name=logincode]').removeClass("is-invalid");
    socket.on('disconnect', function () {//On failed connection
        $('#login-form').show();
        $('input[name=logincode]').addClass("is-invalid");//Make the input say it's wrong
        return false;
    });

    $(this).hide();//Hide the form
    socket.emit('new_player', values['nickname'], values['logincode']);//Emit client new player data

    //Add startup button (and player count)
    $("body").append('<h1 id="player-count" class="h1"></h1><button id="btn-start" type="button" class="btn btn-primary btn-lg">Démarrer la partie</button>');

    var players;
    //Receive list of already connected players
    socket.once('initial_players', function (initial_players) {
        players = initial_players;
        console.log(players);
        $("#player-count").html("Joueurs : " + Object.keys(players).length);
    });

    $("#btn-start").click(function () {
        //Add own hand div
        $("body").append('<div class="player me" id="player-' + socket.id + '">' + players[socket.id].nickname + '<div class="hand" id="hand-' + socket.id + '"></div></div>');
        var tmp = players[socket.id];//Backup for temporary deletion
        delete players[socket.id];//Temporary Deletion
        $("#btn-start").remove();
        for (playerId in players) {
            //Add other players' hands
            $("body").append('<div class="player" id="player-' + playerId + '">' + players[playerId].nickname + '<div class="hand" id="hand-' + playerId + '"></div></div>');
        }
        players[socket.id] = tmp;//Restore backup
        socket.emit("request", "start_game");//Request game startup
    });
    //Updates (Server -> client)
    socket.on('update', function (update) {
        console.log(update);
        switch (update[0]) {
            //player_added : [playerId, player]
            case "player_added":
                players[update[1]] = update[2];
                $("#player-count").html("Joueurs : " + Object.keys(players).length);
                break;
            //player_removed : [playerId]
            case "player_removed":
                delete players[update[1]];
                $("#player-count").html("Joueurs : " + Object.keys(players).length);
                break;
            //hand_update : [playerId, handSize]
            case "hand_update":
                console.log("received hand_update");
                for (let i = 0; i < update[2]; i++) {
                    $("#hand-" + update[1]).append("<img class='card' src='cards/RED_BACK.svg'>")
                }

            default:
                break;
        }
    });

});