$(function() {
  var socket = io.connect();

  var chat = new C.Chat(socket);


  $('#chat-form').on("submit", function (event) {
    event.preventDefault();

    var $message = $("input[type='text']").val();
    chat.sendMessage($message);
    $("input[type='text']").val("");
  });

  socket.on("postMessage", function(data) {
    console.log("POSTMESSAGE")
    var message = data.message;
    $("#messages-board").append("<p>" + message + "</p>");
  })
});