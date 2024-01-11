const { Server } = require('socket.io');
const { roomSocket } = require('./roomSocket');
const { chatController } = require('../controllers/Chat');
const { roomController } = require('../controllers/Room');
const { Game } = require('../class/game');

const game = new Game();
const mongo = require('../db/dbcon');
const { ObjectId } = require('mongodb');
const { generateRaw } = require('./etc');

const socket = async (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      transports: ['websocket', 'polling'],
      credentials: true,
    },
    // pingTimeout: 50000,
    // pingInterval: 50000,
  });

  io.on('connection', async (socket) => {
    console.log('Socket >>> Connected ' + socket.id + '\n' + JSON.stringify(socket.handshake.query));

    let v = await verify(socket.handshake.query.eong);
    if (!v) {
      console.log('비정상적인 소켓연결');
      socket.disconnect(true);
      return;
    } else {
      let data = {
        nick: v.nick,
        total: v.total,
        current: v.current,
        profile: v.profile,
        role: v.role,
        socket_id: socket.id,
        location: socket.handshake.query.location,
      };
      game.connectUser(data);
      socket.emit('initSocket', { id: data.socket_id, loc: data.location });
    }

    socket.on('enterLobby', () => {
      io.emit('getListData', game.getAlls());
    });

    socket.on('disconnect', () => {
      console.log('Socket >>> Disconnected : ' + socket.id);
      game.disconnectUser(socket.id);
    });

    chatController.socket(socket, io, game);
    // roomController.socket(socket, io, roomList, connectedUsers);
    // roomController.sk(socket, io, game);
  });
};

const verify = async (eong) => {
  try {
    // console.log('verify >> ' +  eong);
    let decode = generateRaw(eong);
    let db = await mongo.connect('member');
    let res = await db.findOne({ _id: new ObjectId(generateRaw(eong)) });
    // console.log(res);

    return res || false;
  } catch (ex) {
    console.log(ex);
    return false;
  } finally {
    // console.log('verify >> ' +  eong);
    await mongo.close();
  }
};

module.exports = socket;
