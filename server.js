var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var population = 0;
var userId = 0;
var users = {};
var userNames = [];
var scoreboard = [];
var highestBid = 0;
var highestBidder = null;
var itemVal = -1;
var auction = {'type':"NONE", 
               'item':0};
var deadline = 0;

app.use(express.static(__dirname + '/'));

app.get('/', function(reg, res){
	res.sendFile(__dirname + '/bidio.html');
});

io.on('connection', function(socket){
    var currentUser;
    console.log('Hey!');
    
    socket.on('new user', function(msg){
        console.log(msg);
        population++;
        currentUser = userId;
        userId++;
        users[currentUser] = [0,msg,socket];
        
        // Need to switch this to activeIDs
        userNames.push(currentUser);
        
        // Need to update player count to EVERYONE
        sortScoreboard();
        socket.emit('leaderboard',{'leaderboard':scoreboard});
        
        socket.emit('auction type',auction);
        socket.emit('deadline',deadline);
    });
    
    socket.on('new bid', function(msg){
        msg = parseInt(msg, 10)
        // Check if bid is number
        if(typeof msg==='number' && (msg%1)===0) {
            console.log('NEW BIG: ' + msg);
            // Check if bid is highest and deadline has not passed
            if (msg > highestBid && deadline > Date.now()) {
                // If so, make it highest bid
                highestBid = msg;
                highestBidder = currentUser;
                io.sockets.emit('new interim winner', {'winner':users[highestBidder][1], 'bid':highestBid});
                deadline = Date.now() + 6000;
                socket.emit('deadline',deadline);
            }
            else {
                console.log('INVALID BID1: ' + msg);
            }
        } else {
            console.log('INVALID BID2: ' + msg);
        }
       
    });
    
	socket.on('disconnect', function() {
		console.log(' disconnected');
	})
});

http.listen(3000, function() {
	console.log('listening on *:3000');
    
    
});

// Allow 3 second pause
setTimeout(function(){ 
    startAuction();
}, 3000);

setInterval(function() {
  if (deadline < Date.now() && itemVal != -1) {
      console.log(highestBidder + " WON!")
      
      if (highestBidder != null) {
        // Adjust winners score
        users[highestBidder][0] += (itemVal - highestBid);
        io.sockets.emit('results',{'winner':users[highestBidder][1],
                                    'winningBid':highestBid,
                                    'trueVal':itemVal});
      } else {
          io.sockets.emit('results',{'winner':null,
                                    'winningBid':highestBid,
                                    'trueVal':itemVal});
      }
      // Reset itemVal
      itemVal = -1;
      
      // Sort scoreboard and update everyone
      sortScoreboard();
      io.sockets.emit('leaderboard',{'leaderboard':scoreboard});
      
      // Start a new auction
      // Allow 5 second pause
      setTimeout(function(){ 
          startAuction();
      }, 5000);
  }
}, 500);

function sortScoreboard() {
    var sortable = []
    for (var i = 0; i < userNames.length; i++) {
        sortable.push([users[userNames[i]][1], users[userNames[i]][0]]);
    }

    sortable.sort(function(a,b){return b[1]-a[1]});
    console.log(sortable);
    
    scoreboard = sortable;
}

function startAuction() {
    console.log('okay now');
    
    // Choose itemID
    var itemId = Math.round(Math.random()*835 + 250);
    console.log('' + itemId + ' IS UP FOR BID')
    // Choose value of item
    itemVal = Math.round(Math.random()*10000);
    // Reset highest bid
    highestBid = 0;
    highestBidder = null;
    // Initialize auction object
    auction = {'type':"STANDARD", 
               'item':itemId}
    // Announce auction to all users
    io.sockets.emit('auction type', auction);
    deadline = Date.now() + 60000;
    io.sockets.emit('deadline', deadline);
}
