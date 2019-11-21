var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const { addUser, removeUser, getUser, getUsers, getValidName } = require('./users.js');

const PORT = process.env.PORT || 3000;

const router = require('./router');

io.on('connection', (socket) => {
    socket.on('login', (name) => {
        const validName = getValidName(socket.id, name, 0);
        io.emit('nameValidation', { name: validName });
    });

    socket.on('join', (name) => {
        const { user } = addUser({ id: socket.id, name });
        const users = getUsers();
        io.emit('message', { 
            name: 'APP', 
            text: `${user.name} has joined the chat`,
            timestamp: simpleDate(new Date()),
            users,
        });
    });

    socket.on('send', (text) => {
        const user = getUser(socket.id);
        io.emit('message', { 
            name: user.name, 
            text,
            timestamp: simpleDate(new Date()),
        });
    });

    socket.on('disconnect', () => {
        const user = getUser(socket.id);
        removeUser(socket.id);
        const users = getUsers();
        io.emit('message', { 
            name: 'APP', 
            text: `${user.name} has left the chat`,
            timestamp: simpleDate(new Date()),
            users,
        });
    });
});

const simpleDate = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
};

app.use(router);

http.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
