
const { Server } = require('socket.io');
const MessageController = require('./controllers/MessageController');
const ResponseDTO = require('./utils/ResponseDTO');
const AuthMiddleware = require('./middlewares/AuthMiddleware');
const ChatRepository = require('./repository/ChatRepository');
const MessageRepository = require('./repository/MessageRepository');
const WebsocketConnectionRepository = require('./repository/WebsocketConnectionRepository');

const socketIO = new Server({
  cors: { origin: '*' }
});

const messageController = new MessageController();

const wrapMiddleware = middleware => (socket, next) => middleware(socket.request, {}, next);

socketIO.use(wrapMiddleware(AuthMiddleware));

async function messageSender(senderId, chat) {

  const receiverId = chat.member_one_id === senderId ? chat.member_two_id : chat.member_one_id;

  const senderSockets = await WebsocketConnectionRepository.getListByUser(senderId);
  
  const receiverSockets = await WebsocketConnectionRepository.getListByUser(receiverId);

  const response = ResponseDTO.success(ResponseDTO.SUCCESS, chat);

  if (senderSockets.length > 0)
    socketIO.to(senderSockets.map(i=> i.socket_id)).emit('message_created', response);

  if (receiverSockets.length > 0)
    socketIO.to(receiverSockets.map(i=> i.socket_id)).emit('message', response);
}

async function notificationSender(receiverId, notification, transaction) {
  const result = await MessageRepository.createNotification(receiverId, notification, transaction);
  const message = await MessageRepository.getWithTransaction(result.message.id, transaction);
  const chat = await ChatRepository.getWithTransaction(result.chat.id, transaction);
  chat.setDataValue('messages', [message]);
  return chat;
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
    messageController.sendMessage(socket, Number(receiverId), content);
  });

  socket.on('application_support', ()=> {
    messageController.getApplicationSupport(socket);
  });

  socket.on('message_recipient', (memberId)=> {
    messageController.getMessageRecipient(socket, Number(memberId));
  });

  socket.on('message_recipients', (lastDate, pageLimit)=> {
    messageController.getMessageRecipients(socket, lastDate, Number(pageLimit));
  });

  socket.on('messages', (memberId, lastDate, pageLimit)=> {
    messageController.getMessages(socket, Number(memberId), lastDate, Number(pageLimit));
  });

  socket.on('messages_update_delivery_status', (memberId)=> {
    messageController.updateDeliveryStatus(socket, Number(memberId));
  });

  socket.on('disconnect', async ()=> {
    await WebsocketConnectionRepository.deleteBySocketId(socket.id);
  });
});

module.exports = { socketIO, messageSender, notificationSender };
