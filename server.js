const http = require('http');
const express = require('express');
const app = express();
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
}
);

io.on('connection', (socket) => {

     socket.broadcast.emit('user connected', 'A new user has joined the chat!');
        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
        });
  
});



server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    });
