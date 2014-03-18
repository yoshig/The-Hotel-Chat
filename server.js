var static = require('node-static');
var mime = require('mime');
var http = require('http');
var fs = require('fs');
var path = require('path');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public');

var staticServer = require('http').createServer(function (request, response) {
    request.addListener('end', function () {

        console.log("recieved req. from ", request.url);

        file.serve(request, response);
    }).resume();
}).listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var createChat = require("./lib/chat_server.js").createChat;
createChat(staticServer);