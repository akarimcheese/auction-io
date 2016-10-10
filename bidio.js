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
