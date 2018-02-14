# Simple Notification with socket.io
Simple implementation of 'Web' client notification with node.js and socket.io

# How to use it?

## Start Server:
1. Clone the project 
2. Change directory to root directort of project
3. run following command to install required modules
```
$ npm install 
```
4. run following command to star the server
```
$ node server.js 
```

## Start one or multiple Clients:
1. Open browser
2. Go to URL http://localhost:3000/client
3. Optional: open multiple browsers and go to the same url

## Send Notification:
1. Open browser and go to (or CURL to) the URL http://localhost:3000/push?message=HiNotificationMessage
