var socket = io();
var username = "Default";
var value = 0;
var user = -1;
var deadline = 0;
var timer = -1;
var templateBid = $("#templateBid")

$('#usernameEnter').click(function(){
    username = $('#username').val()
    socket.emit('new user', username);
    /* Wait for verification */
    $('#startUp').css("left","100%");
    /* Get auction info */
})

$('#bidEnter').click(function(){
    var bid = $('#bidInput').val()
    socket.emit('new bid', bid);
    /* Wait for verification */
})

socket.on('leaderboard', function(obj) {
        var leaderboard = obj.leaderboard;
    
        for (var i = 0; i < 10; i++) {
            if (leaderboard[i]) {
            $('#rank' + (i + 1)).html(leaderboard[i][0])
            $('#score' + (i + 1)).html(leaderboard[i][1])
            }
        }
});

socket.on('deadline', function(obj) {
        deadline = obj;
});

socket.on('results', function(obj) {
    var winner = obj.winner;
    var bid = obj.winningBid;
    var val = obj.trueVal;
        
    // Take back item
    $('#upForBidDiv').css("top","-100%");
    $('#results').css("top","-300px");
    
    // Reveal auction info
    $('#winnerReveal').html(winner);
    $('#valueReveal').html("$" + val);
    $('#bidReveal').html("$" + bid);
    $('#bidInput').val("0")
});

socket.on('auction type', function(obj) {
        var auctionType = obj.type;
        var auctionItem = obj.item;
    
        $('#upForBid').attr("src","https://unsplash.it/250/?image=" + auctionItem)
        // CHANGE TITLE TO SAY STANDARD AUCTION
        
        // CHANGE INTERIM WINNER
        $('#highestBidder').html("None");
        // CHANGE HIGHEST BID
        $('#highestBid').html("0");
    
        // Bring in item
        $('#results').css("top","-1000px");
        $('#upForBidDiv').css("top","20%");
});

socket.on('new interim winner', function(obj) {
        var winner = obj.winner;
        var bid = obj.bid;
    
        // CHANGE INTERIM WINNER
        $('#highestBidder').html(winner);
        // CHANGE HIGHEST BID
        $('#highestBid').html(bid);
        
        //ANIMATION
        var bidElement = templateBid.clone();
        bidElement.find('h3').html(winner);
        bidElement.find('h1').html("$" + bid);
    
        bidElement.css("left","" + Math.round(Math.random()*($(window).width() - 200) + 100) + "px");
        bidElement.css("position","absolute");
    
        $('#crowd').append(bidElement);
        
        setTimeout(function() {
            bidElement.remove();
        }, 4000)
});

setInterval(function() {
  timer = Math.round((deadline - Date.now() - 100)/100)/10.0
  if (timer >= 0) {
    $('#timeLeft').html(timer);
  }
}, 100);
/*
$('#getMatch').click(function(){
    socket.emit('match ready', user);
    $('#currentAction').text('Current action: Stay');
    swerve = false;
    $('#player-car-back').css("left","400px");
    $('#player-car-top').css("left","400px");
    $('#player-car-back').css("transform","rotate(0deg)");
    $('#player-car-top').css("transform","rotate(0deg)");
    $('#player-car-back').css("-o-transform","rotate(0deg)");
    $('#player-car-top').css("-o-transform","rotate(0deg)");
    $('#player-car-back').css("-moz-transform","rotate(0deg)");
    $('#player-car-top').css("-moz-transform","rotate(0deg)");
    $('#player-car-back').css("-webkit-transform","rotate(0deg)");
    $('#player-car-top').css("-webkit-transform","rotate(0deg)");
    $('#opp-container').css("left","400px");
    $('#opp-car-top').css("margin-left","0px");
    $('#opp-car').css("transform","rotate(0deg)");
    $('#opp-car-top').css("transform","rotate(0deg)");
    $('#opp-car').css("-o-transform","rotate(0deg)");
    $('#opp-car-top').css("-o-transform","rotate(0deg)");
    $('#opp-car').css("-moz-transform","rotate(0deg)");
    $('#opp-car-top').css("-moz-transform","rotate(0deg)");
    $('#opp-car').css("-webkit-transform","rotate(0deg)");
    $('#opp-car-top').css("-webkit-transform","rotate(0deg)");
    $('#opp-container').removeClass('unleash');
    $('#getMatch').text('Waiting...');
    return false;
});

$('#swerve').click(function(){
    if (!swerve) {
        $('#currentAction').text('Current action: Swerve');
        socket.emit('swerve','');
        swerve = true;
    }
    return false;
});

$('#stay').click(function(){
    if (swerve) {
        $('#currentAction').text('Current action: Stay');
        socket.emit('stay','');
        swerve = false;
    }
    return false;
});

socket.on('onon', function(msg) {
        user = parseInt(msg);
        $('#GUI').text('Your User ID is ' + msg);
});

socket.on('userCount', function(msg) {
        $('#pop').text('Users online: ' + msg);
});

socket.on('Score', function(msg) {
        $('#score').text('Score: ' + msg);
});

socket.on('Result', function(msg) {
        if (parseInt(msg) == -1) {
            $('#player-car-back').css("left","-=100");
            $('#player-car-top').css("left","-=100");
            $('#currentAction').text('You chickened out!');
        } else if (parseInt(msg) == 0) {
            $('#player-car-back').css("left","-=100");
            $('#player-car-top').css("left","-=100");
            $('#opp-container').css("left","+=100");
            $('#opp-car-top').css("margin-left","+=100");
            $('#currentAction').text('Both of you chickened out!');
        } else if (parseInt(msg) == 1) {
            $('#opp-container').css("left","+=100");
            $('#opp-car-top').css("margin-left","+=100");
            $('#currentAction').text('You won!');
        } else if (parseInt(msg) == -10) {
            setTimeout (function () {
                $('#player-car-back').css("-webkit-transform","rotate(45deg)");
                $('#player-car-top').css("-webkit-transform","rotate(45deg)");
                $('#player-car-back').css("-o-transform","rotate(45deg)");
                $('#player-car-top').css("-o-transform","rotate(45deg)");
                $('#player-car-back').css("-moz-transform","rotate(45deg)");
                $('#player-car-top').css("-moz-transform","rotate(45deg)");
                $('#player-car-back').css("transform","rotate(45deg)");
                $('#player-car-top').css("transform","rotate(45deg)");

                $('#opp-car').css("-webkit-transform","rotate(-45deg)");
                $('#opp-car-top').css("-webkit-transform","rotate(-45deg)");
                $('#opp-car').css("-o-transform","rotate(-45deg)");
                $('#opp-car-top').css("-o-transform","rotate(-45deg)");
                $('#opp-car').css("-moz-transform","rotate(-45deg)");
                $('#opp-car-top').css("-moz-transform","rotate(-45deg)");
                $('#opp-car').css("transform","rotate(-45deg)");
                $('#opp-car-top').css("transform","rotate(-45deg)");
                $('#currentAction').text('You crashed!');
            }, 500);
        }
}); 

socket.on('match start', function(msg) {
        /*
        inMatch = true;
        $('#GUI').text('Your User ID is ' + user + ', your opponent is ' + msg);
        $('#road-yellow').removeClass('pause');
        $('#opp-car').removeClass('pause');
        $('#redbloop').removeClass('pause');
        $('#bluebloop').removeClass('pause');
        $('#opp-car-top').removeClass('pause');

        setTimeout( function(){ 
            $('#opp-container').addClass('unleash');
            inMatch = false;
            setTimeout( function() {
                $('#road-yellow').addClass('pause');
                $('#opp-car').addClass('pause');
                $('#redbloop').addClass('pause');
                $('#bluebloop').addClass('pause');
                $('#opp-car-top').addClass('pause');
                $('#getMatch').text('Ready');
                $('#GUI').text('Your User ID is ' + user);
            }, 1000);
          }  , 9000 ); 
});
*/
