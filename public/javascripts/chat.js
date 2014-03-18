(function(root) {
  var C = root.C = (root.C || {});

  var Chat = C.Chat = function(socket) {
    this.socket = socket
  };

  Chat.prototype.sendMessage = function(message) {
    this.socket.emit("sendMessage", { message: message });
  }
}(this));