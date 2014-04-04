(function(root) {
  var C = root.C = (root.C || {});

  var Chat = C.Chat = function(socket) {
    this.socket = socket
  };

  Chat.prototype.sendMessage = function(message) {
    this.socket.emit("sendMessage", { message: message });
  };

  Chat.prototype.handleCommand = function(message) {

    if (message.match("^/nick"  )) {
      var newNickname = message.substr(6);
      this.socket.emit("nicknameChangeRequest", { newNickname: newNickname });
    } else if (message.match("^/join")) {
      var newRoom = message.substr(6);
      this.socket.emit("handleRoomChangeRequest", { room: newRoom });
    } else {
      this.sendMessage(message);
    }
  };
}(this));