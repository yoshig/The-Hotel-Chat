/* global require */

var io = require('socket.io'), fs = require('fs');

var createChat = function(static_server) {
  var io_server = io.listen(static_server);

  io_server.sockets.on('connection', function (socket) {
    console.log("CONNECTED");

    socket.on("sendMessage", function(data) {
      console.log(data)
      console.log("!!!!")
      var message = data.message;
      io_server.sockets.emit("postMessage", { message: message});
    });

  });
}

exports.createChat = createChat;