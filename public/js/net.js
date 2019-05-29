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

    $("#game").append('<h1 id="player-count" class="h1"></h1>');
    $("#instruction").html('<h2>En attente du démarrage de la partie...</h2>');

    //Add startup button when needed
    socket.once('lead_given', function () {
        $("#instruction").hide();
        $("#my-field").append('<button id="btn-start" type="button" class="btn btn-primary btn-lg">Démarrer la partie</button>');
        $("#btn-start").click(function () {
            socket.emit("request", ["start_game"]);//Request game startup
        });
    });

    var players;
    //Receive list of already connected players
    socket.once('initial_players', function (initial_players) {
        players = initial_players;
        console.log(players);
        $("#player-count").html("Joueurs : " + Object.keys(players).length);
    });

    socket.on('game_started', function(){
        console.log('game_started');
        //Add own hand div
        $("#my-field").append('<div class="player me" id="player-' + socket.id + '">' + players[socket.id].nickname + '<div class="hand" id="hand-' + socket.id + '"></div></div>');
        var tmp = players[socket.id];//Backup for temporary deletion
        delete players[socket.id];//Temporary Deletion
        $("#btn-start").remove();
        for (playerId in players) {
            //Add other players' hands
            $("#game").append('<div class="player" id="player-' + playerId + '">' + players[playerId].nickname + '<div class="hand" id="hand-' + playerId + '"></div></div>');
        }
        players[socket.id] = tmp;//Restore backup
        $("#instruction").empty();
    })

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
                $("#hand-" + update[1]).empty();
                for (let i = 0; i < update[2]; i++) {
                    $("#hand-" + update[1]).append("<img class='card' id='" + update[1] +'@'+ i + "' src='cards/RED_BACK.svg'>")
                }
                break;

            case "your_turn":
                console.log("It's my turn");
                break;

            case "power_usable":
                $("#instruction").show();
                switch (update[1]) {
                    case "check_self":
                        $("#instruction").html('<h2>Vous pouvez regarder une de vos cartes</h2>');
                        console.log("#hand-" + socket.id);
                        //TODO add a confirm button
                        var cardImgId;
                        $("#hand-" + socket.id).children().addClass("toCheck").one("click", function () { 
                            console.log("Asking for " + $(this).attr('id'));
                            cardImgId = $(this).attr('id');
                            socket.emit("request", ["card_value", cardImgId]);//Request card value
                            $("#hand-" + socket.id).children().removeClass("toCheck").unbind("click");
                        });
                        socket.once('card_check_response', function (card_values) {
                            $("#" + socket.id + "\\@" + cardImgId.match("[0-9]+$")).attr('src', 'cards/' + card_values[0] + card_values[1]+".svg");
                        });
                        break;
                    case "check_other":
                        $("#instruction").html('<h2>Vous pouvez une carte d\'un adversaire</h2>');
                        break;
                    case "swap":
                        $("#instruction").html('<h2>Vous pouvez échanger une carte avec celle d\'un adversaire</h2>');
                        break;
                    default:
                        break;
                }
                break;

            default:
                break;
        }
    });

});