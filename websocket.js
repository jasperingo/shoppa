
const { Server } = require('socket.io');
const MessageController = require('./controllers/MessageController');
const AuthMiddleware = require('./middlewares/AuthMiddleware');
const WebsocketConnectionRepository = require('./repository/WebsocketConnectionRepository');

const socketIO = new Server({
  cors: {
    origin: '*'
  }
});

const messageController = new MessageController();

const wrapMiddleware = middleware => (socket, next) => middleware(socket.request, {}, next);

socketIO.use(wrapMiddleware(AuthMiddleware));

async function messageSender() {
  console.log(998);
  return null;
}

socketIO.on('connection', async (socket)=> {

  try {
    await WebsocketConnectionRepository.create(socket.request.auth.userId, socket.id);
  } catch {
    socket.disconnect();
  }

  socket.on('unreceived_messages_count', ()=> {
    messageController.getNumberOfUnreceivedMessages(socket);
  });

  socket.on('message', (receiverId, content)=> {
    messageController.sendMessage(socket, receiverId, content);
  });

  socket.on('message_recipient', (memberId)=> {
    messageController.getMessageRecipient(socket, memberId);
  });

  socket.on('message_recipients', (lastDate, pageLimit)=> {
    messageController.getMessageRecipients(socket, lastDate, pageLimit);
  });

  socket.on('messages', (memberId, lastDate, pageLimit)=> {
    messageController.getMessages(socket, memberId, lastDate, pageLimit);
  });

  socket.on('messages_update_delivery_status', (memberId)=> {
    messageController.updateDeliveryStatus(socket, memberId);
  });

  socket.on('disconnect', async ()=> {
    await WebsocketConnectionRepository.deleteBySocketId(socket.id);
  });
});

module.exports = { socketIO, messageSender };
