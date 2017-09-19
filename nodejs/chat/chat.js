var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var fs = require('fs');

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) =>{
    fs.readFile('./index.html', 'utf-8', (error, content)=>{
        res.setHeader('Content-Type', 'text/html');
        res.write(content);
        res.end();
    })
});

io.sockets.on('connection', (socket)=>{
    console.log('Client connected');

    socket.on('new_client', (username)=>{
        console.log(username + ' joined the chat.');
        socket.broadcast.emit('new_cli', username + ' joined the chat');
    })
    .on('send_msg', (txt_msg, username)=>{ //Make it secure? with module ent
        console.log(txt_msg + ' ' + username);
        content = [username, txt_msg];
        console.log(content);
        socket.broadcast.emit('new_msg', content);
    })
    .on('cli_left', (username)=>{
        console.log(username + ' left');
        content = ["Server", username + ' left the chat room'];
        socket.broadcast.emit('new_msg', content);
    })
    .on('newUsername', (newUsername)=>{
        console.log(newUsername[1] + ' is now called ' + newUsername[0]);
        content = ["Server", newUsername[1] + ' is now called ' + newUsername[0]];
        socket.broadcast.emit('new_msg', content);
    });

});

server.listen(PORT, ()=>{
    console.log('Started on port ' + PORT);
})