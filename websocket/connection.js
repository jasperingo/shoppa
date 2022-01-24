
module.exports = (io)=> {

  return (socket)=> {

    socket.on('message', (msg)=> {
      console.log(`we received a ${msg}`);
      io.emit('message', 'Lets go');
    });

    console.log(`Web socket connected on ${socket.id}`);

  }

}
