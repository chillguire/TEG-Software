module.exports = function (io) {

    io.on('connection', async (socket) => {

        socket.on('join-room', (roomID, userID) => {

            socket.join(roomID);
            socket.to(roomID).broadcast.emit('user-connected', userID);

            socket.on('message', (message) => {
                console.log(message);
                io.to(roomID).emit('create-message', message);
            });

            socket.on('disconnect', () => {
                socket.to(roomID).broadcast.emit('user-disconnected', userID);
            });
        });

    });
}