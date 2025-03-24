// Socket.io configuration
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected');

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    // Add more socket event handlers as needed
  });
};