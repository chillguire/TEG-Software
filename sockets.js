const Chat = require('./models/chat');

module.exports = function (io) {

    io.on('connection', async (socket) => {
        //** videoconference
        socket.on('join-room', (roomID, userID) => {

            socket.join(roomID);
            socket.to(roomID).emit('user-connected', userID);

            socket.on('message', (message) => {
                io.to(roomID).emit('create-message', message);
            });

            socket.on('disconnect', () => {
                socket.to(roomID).emit('user-disconnected', userID);
            });
        });
        //** videoconference

        //** chat
        //?users
        //- send all existing users to the newly connected client
        const users = []; // cambiar esto luego por db
        for (let [id, socket] of io.of('/').sockets) {
            users.push({
                userID: id,
                username: socket.handshake.auth.username,
            });
            console.log('users:', users);
        }
        socket.emit('existing users', users);


        const messages = await Chat.find({})/*.limit(8)*/;
        socket.emit('load old messages', messages);

        //- notify existing users of the newly connected client existence
        socket.broadcast.emit('user connected', {
            userID: socket.id,
            username: socket.handshake.auth.username,
        });
        //?users

        //?messages
        socket.on('new message sent', async function (message, callback) {
            let sanitizedMessage = message.trim()

            if (sanitizedMessage.substr(0, 3) === '/p ') {
                sanitizedMessage = sanitizedMessage.substr(3);
                init = sanitizedMessage.indexOf('(');
                end = sanitizedMessage.indexOf(')');
                if (init !== -1 && end !== -1) {
                    const recipentUser = sanitizedMessage.substr(init + 1, end - init - 1);
                    sanitizedMessage = sanitizedMessage.substr(end + 2);
                    console.log('users:', users);
                    for (let i = 0; i < users.length; i++) {
                        console.log('recipent:', recipentUser);
                        console.log('users[i]:', users[i]);
                        if (recipentUser == users[i].username) {
                            if (recipentUser == socket.handshake.auth.username) {
                                callback('No puedes enviar mensajes privados a ti mismo');
                                break;
                            }
                            io.sockets.to(users[i].userID).emit('private', {
                                content: sanitizedMessage,
                                author: socket.handshake.auth.username,
                            });
                            console.log('got here');
                            break;
                        }
                    }
                } else {
                    callback('Ingresa un mensaje');
                }
            } else {
                await new Chat({
                    author: socket.handshake.auth.username,
                    content: message,
                }).save();

                io.sockets.emit('new message', {
                    content: message,
                    author: socket.handshake.auth.username,
                });
            }


        });
        //?messages


        socket.on('disconnect', () => {
            socket.broadcast.emit('user disconnected', socket.id);
        });
        //** chat
    });
}