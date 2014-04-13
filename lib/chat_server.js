/* global require */

var io = require('socket.io'), fs = require('fs');

var createChat = function(static_server) {
  var io_server = io.listen(static_server);
  var guestnumber = 0;
  var usedNicknames = [];
  var nicknames = {};
  var currentRooms = {};
  var defaultRoom = "The Hotel California";

  var joinRoom = function(socket, room) {
    currentRooms[socket.id] = room;
    socket.join(room);
  };

  var roomMembers = function(room) {
    var members = [];
    for (var member in currentRooms) {
      if (currentRooms[member] === room) {
        members.push(nicknames[member]);
      }
    }
    return members;
  };

  io_server.sockets.on('connection', function (socket) {
    joinRoom(socket, defaultRoom)

    guestnumber++;
    nicknames[socket.id] = "guest" + guestnumber;
    var newNickname = "guest" + guestnumber;

    socket.emit("roomChangeResult", {
      room: defaultRoom,
      members: roomMembers(defaultRoom)
     });

    socket.emit("nicknameChangeResult", {
      success: true,
      message: "Your name is " + newNickname + ".",
      nickname: newNickname
    });
    socket.broadcast.to(defaultRoom).emit("roomListUpdate", {
      members: roomMembers(defaultRoom)
    })

    socket.on('disconnect', function(){
      var room = currentRooms[socket.id]
      var left = roomMembers(room)
      socket.broadcast.to(room).emit("roomListUpdate", {
        members: left
      });
      delete currentRooms[socket.id]
      delete nicknames[socket.id]
    })

    socket.on("handleRoomChangeRequest", function(data) {
      var roomEnter = data.room;
      var roomLeave = currentRooms[socket.id]

      socket.leave(roomLeave);
      joinRoom(socket, roomEnter);

      var membersEnter = roomMembers(roomEnter)
      var membersLeave = roomMembers(roomLeave)
      socket.emit("roomChangeResult", {
        room: roomEnter,
        members: membersEnter
      });
      socket.broadcast.to(roomEnter).emit("roomListUpdate", {
        members: membersEnter
      });
      socket.broadcast.to(roomLeave).emit("roomListUpdate", {
        members: membersLeave
      });
    });

    socket.on("nicknameChangeRequest", function(data) {
      var newNickname = data.newNickname;
      var convention = new RegExp("guest", "i");

      if (usedNicknames.indexOf(newNickname) !== -1) {
        socket.emit("nicknameChangeResult", {
          success: false,
          message: "That name is already taken",
					nickname: nicknames[socket.id]
        });
      } else if (newNickname.match(convention)) {
        socket.emit("nicknameChangeResult", {
          success: false,
          message: "You can't put 'guest' in the nickname",
					nickname: nicknames[socket.id]
        });
      } else {
        nicknames[socket.id] = newNickname;
        usedNicknames.push(newNickname);
				
				//upon adding the new name, update the room's members.
	      socket.broadcast.to(currentRooms[socket.id]).emit("roomListUpdate", {
	        members: roomMembers(currentRooms[socket.id])
	      });
				
		    socket.emit("roomListUpdate", {
		      members: roomMembers(currentRooms[socket.id])
		    })
				
        socket.emit("nicknameChangeResult", {
          success: true,
          message: "Your name is now " + newNickname + ".",
          nickname: newNickname
        });
      }
    });

    socket.on("sendMessage", function(data) {
      console.log("messageSent")
      var message = data.message;
      var nickname = nicknames[socket.id];
      var room = currentRooms[socket.id];
      socket.broadcast.to(room).emit("postMessage", {
        text: ("<span class='room-style'>" + room + ":: </span>" + 
							 "<span class='in-chat'>" + nickname + ": </span>" + 
							 message)
      });
      socket.emit("postMessage", {
        text: ("<span class='in-chat'>" + nickname + ": </span>" + 
							 message)
      });
    });

  });
}

exports.createChat = createChat;