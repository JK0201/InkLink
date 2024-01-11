let roomNum = 0;

exports.roomController = {
  socket: (socket, io, game) => {
    socket.on('createRoom', (data) => {
      if (!titleValid(data.title)) {
        console.log('제목 미입력');
        return;
      }

      if (!data.maxUser) {
        console.log('최대인원 미선택');
        return;
      }

      if (data.private && !passwordValid(data.password)) {
        console.log('비밀번호 미입력');
        return;
      }

      if (!data.private) {
        data.password = '';
      }

      const roomId = Math.random().toString(36).substring(2, 11);

      game.createRoom(roomId, data.title, data.maxUser, data.password);
      game.changeLocation(socket.id, roomId);

      console.log(game.roomList);
      //나중에 refresh로 바꿀것
      io.emit('roomList', game.getAlls());
      socket.emit('enterRoom', roomId);
    });

    socket.on('joinRoom', (data) => {
      console.log(data.roomId);
      game.changeLocation(socket.id, data.roomId);
      // const idx = roomList.findIndex((item) => {
      //   return item.roomId === dataId;
      // });

      // if (idx !== -1) {
      // }
    });
  },
};

function titleValid(title) {
  const titleChk = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ ]{2,15}$/;
  return titleChk.test(title);
}

function passwordValid(pass) {
  const passChk = /^[0-9]{4,6}$/;
  return passChk.test(pass);
}
