var socket;
$('#login-form').submit(function (e) {
    e.preventDefault();
    // get all the inputs into an array.
    var inputs = $('#login-form :input');
    //Get the values of the inputs
    var values = [];
    values['nickname'] = inputs[0].value;
    values['logincode'] = inputs[1].value;

    document.title = values['logincode'] + ' - ' + values['nickname'];
    // Connexion à socket.io
    
    socket = io.connect('http://localhost:8080');

    $('input[name=logincode]').removeClass("is-invalid");
    socket.on('disconnect', function () {
        $('#login-form').show();
        $('input[name=logincode]').addClass("is-invalid");
        return false;
    });

    $(this).hide();
    socket.emit('new_player', values['nickname'], values['logincode']);

    $("body").append('<h1 id="player-list" class="h1"></h1><button type="button" class="btn btn-primary btn-lg">Démarrer la partie</button>');

    var players;
    //Réception initiale de la liste des joueurs déjà présents
    socket.once('initial_players', function (initial_players) {
        players = initial_players;
        console.log(players);
        //TODO Load players
        $("#player-list").html("Joueurs : " + Object.keys(players).length);
    });
    

    //Mises à jour
    socket.on('update', function (update) {
        console.log(update);
        switch (update[0]) {
            case "player_added":
                players.push(update[1]);
                $("#player-list").html("Joueurs : " + Object.keys(players).length);
                //TODO Load players
                break;
                case "player_removed":
                players.splice(update[1], 1);
                $("#player-list").html("Joueurs : " + Object.keys(players).length);
                //TODO Load players
                break;
            default:
                break;
        }
    });
    
});