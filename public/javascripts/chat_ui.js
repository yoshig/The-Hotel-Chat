$(function() {
  var socket = io.connect();

  var chat = new C.Chat(socket);


  $('#chat-form').on("submit", function (event) {
    event.preventDefault();

    var $message = $("input[type='text']").val();
    var nameChangeCommand = new RegExp("^/");

    if ($message.match(nameChangeCommand)) {
      chat.handleCommand($message)
    } else {
      chat.sendMessage($message);
    }
    $("input[type='text']").val("");
  });

  socket.on("nicknameChangeResult", function(data) {
		if (data.message) {
			$('#messages-board').prepend('<p class="error-message">' + data.message + '</p>');
			$('#username').html("<p class='fancy-font nickname'>Le nickname: <span class='nickname'>" + data.nickname + "</span></p>");
		} else {
	    $('#username').html("<p class='fancy-font nickname'>Le nickname: <span class='nickname'>" + data.newNickname + "</span></p>");
		}
  })

  socket.on("roomChangeResult", function(data) {
    $("#current-room").html("<span class='nickname'> Welcome To: " + data.room + '</span>');
    $("#room-members").html("");
    data.members.forEach(function(member) {
      $("#room-members").prepend("<li class='fancy-font in-chat'>"+ member + "</li>")
    })
  });

  socket.on("postMessage", function(data) {
    console.log("POSTMESSAGE")
    var text = data.text;
    $("#messages-board").prepend("<p class='fancy-font'>" + text + "</p>");
  });

  socket.on("roomListUpdate", function(data) {
    $("#room-members").html("");
    data.members.forEach(function(member) {
      $("#room-members").prepend("<li class='fancy-font in-chat'>"+ member + "</li>")
    })
  });
});