The-Hotel-Chat
==============

This web application is based on event-driven programming and runs off of Node.js. It mimics internet chatrooms! People can join a chatroom, and see messages updated LIVE, as well as other users in the room. You can do cool stuff like changing your name and switching rooms by typing in special commands in the chat-line. The "hotel" theme was based off our text title: "Welcome to: The Hotel California"

+ Implements Live time room joining and chatting through websockets. 
+ Chat-line commands applied with RegExp. 
+ Custom CSS and theming.less

To run this locally, you will need to have node installed.
Be sure to run npm install. If for some reason it's still not running, you may also have to install the dependencies individually (at the top of server.js, which are listed as require("dependency")). To do this, run npm install dependency --save (where dependency is the actual dependency name you install).
Then run node server.js, open up localhost:8080, and it should be up and running!
