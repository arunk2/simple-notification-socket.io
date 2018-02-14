var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.set('port', 3000);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var connectionsArray = [];

/**
 * Api to send message to user.
 */
app.get('/push', function(req, res) {
	console.log('push....');

	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var message = query.message;

	if (message) {
		updateSockets(message);
		res.send('Success');
	}
	else {
		res.status(400).send('Bad Request');
	}
});


/**
 * Api to client for notification
 */
app.get('/client', function(req, res) {
        console.log('client....');
	var path = require('path');
	res.sendFile(path.join(__dirname + '/public/client.html'));
});

/**
 * New websocket to keep the content updated without any AJAX request
 */
io.on('connection', function(socket) {
  console.log('Number of connections:' + connectionsArray.length);

  socket.on('disconnect', function() {
    var socketIndex = connectionsArray.indexOf(socket);
    console.log('socketID = %s got disconnected', socketIndex);
    if (~socketIndex) {
      connectionsArray.splice(socketIndex, 1);
    }
  });

  console.log('A new socket is connected!');
  connectionsArray.push(socket);

});


/**
 * Update the clients listening on websockets
 */
var updateSockets = function(data) {
 
    var cur_time = new Date();
    console.log('Pushing to clients ( connections = %s ) - %s', connectionsArray.length , cur_time);
    
    //Sending data to all the sockets connected
    connectionsArray.forEach(function(tmpSocket) {
              tmpSocket.volatile.emit('notification', data);
	});
};

/**
 * Start the Web App
 */
http.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

