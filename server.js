var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.set('port', 3000);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

io = socket.listen(app);

var connectionsArray = [];


/**
 * Api to send message to user.
 */
app.get('/push', function(req, res) {
	var message = req.params['message'];
	if (message) {
		updateSockets({message}, 'data');
		res.send();
	}
	else {
		res.status(400).send('Bad Request');
	}
});


// creating a new websocket to keep the content updated without any AJAX request
io.on('connection', function(socket) {
  console.log('Number of connections:' + connectionsArray.length);

  socket.on('disconnect', function() {
    var socketIndex = connectionsArray.indexOf(socket);
    console.log('socketID = %s got disconnected', socketIndex);
    if (~socketIndex) {
      connectionsArray.splice(socketIndex, 1);
    }
    updateSockets({},'connection_counter');
  });

  console.log('A new socket is connected!');
  connectionsArray.push(socket);

});

var updateSockets = function(data, notificationType) {
 
    // adding the time of the last update
    data.time = new Date();
    data.connectionCounter = connectionsArray.length;
    console.log('Pushing new data to the clients connected ( connections amount = %s ) - %s', connectionsArray.length , data.time);
    
    notificationType = typeof notificationType !== 'undefined' ? notificationType : '';
    
    // sending new data to all the sockets connected
    connectionsArray.forEach(function(tmpSocket) {
        
        if (notificationType !== '') {		  
              tmpSocket.volatile.emit(notificationType, data);
        } else {
              tmpSocket.volatile.emit('notification', data);
        }	  
	});
};


http.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

