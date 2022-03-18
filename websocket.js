
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

  socket.on('message_recipients', (lastDate, pageLimit)=> {
    messageController.getMessageRecipients(socket, lastDate, pageLimit);
  });

  socket.on('messages', (chatId, lastDate, pageLimit)=> {
    messageController.getMessages(socket, chatId, lastDate, pageLimit);
  });

  socket.on('disconnect', async ()=> {
    await WebsocketConnectionRepository.deleteBySocketId(socket.id);
  });
});

module.exports = { socketIO, messageSender };
