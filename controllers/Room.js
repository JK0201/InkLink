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
      game.changeLocation(io, socket, roomId);
      socket.emit('enterCreatedRoom', roomId);
    });

    socket.on('joinRequest', (data) => {
      const room = game.getRoomById(data.id);

      if (!room) {
        console.log('방이 존재하지 않음');
        return;
      }

      if (room._password) {
        if (!passwordValid(data.password)) {
          console.log('비밀번호 형식 오류');
          return;
        }

        if (room._password !== data.password) {
          console.log('비밀번호 불일치');
          return;
        }
      }
      game.changeLocation(io, socket, data.id);
      socket.emit('enterRoom', data.id);
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
