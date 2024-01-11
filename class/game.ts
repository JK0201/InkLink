interface roomSetting {
  lang: number; //언어
  max: number; //최대인원
  limit: number; //제한시간
  round: number; //라운드
  useCustom: boolean; //커스텀사용여부
  customs: string[]; //커스텀목록
  owner: string; //방장 소켓ID
}
const defaultSetting: roomSetting = {
  lang: 0,
  max: 8,
  limit: 60,
  round: 3,
  useCustom: false,
  customs: [],
  owner: '',
};
interface User {
  socket_id: string;
  nick: string;
  total: number;
  current: number;
  profile: string;
  role: number;
  location: string;
}
interface userInRoom {
  socket_id: string;
  nick: string;
  profile: string;
  total: number;
  current: number;
  status: number;
}
class Room {
  private _id: string;
  private _title: string;
  private _password: string;
  private _setting: roomSetting = defaultSetting;
  private _status: number = 0;
  private _timer: number = 0;
  private _users: userInRoom[] = [];
  private _answer: string;
  private _roomNumber: number;

  constructor(id: string, title: string, maxUser: number, password: string, number: number) {
    this._id = id;
    this._title = title;
    this._password = password;
    this._setting.max = maxUser;
    this._roomNumber = number;
  }

  infoForList() {
    return {
      id: this._id,
      roomNumber: this._roomNumber,
      title: this._title,
      currentUser: this._users.length,
      maxUser: this._setting.max,
      password: this._password,
      status: this._status,
    };
  }
  addUser(data: userInRoom) {
    this._users.push(data);
    if (this._users.length === 1) {
      this._setting.owner = data.socket_id;
    }
    // return this._users;
  }
  delUserBySocketID(socket_id: string) {
    this._users = this._users.filter((user) => user.socket_id !== socket_id);
    return this._users.length;
  }
  changeSetting(data: [number, any]) {
    switch (data[0]) {
      case 0:
        this._setting.lang = data[1];
        break;
      case 1:
        this._setting.max = data[1];
        break;
      case 2:
        this._setting.limit = data[1];
        break;
      case 3:
        this._setting.round = data[1];
        break;
      case 4:
        this._setting.useCustom = data[1];
        break;
      case 5:
        this._setting.customs = data[1];
        break;
    }
  }
  get users() {
    return this._users;
  }
  get setting() {
    return this._setting;
  }
  get id() {
    return this._id;
  }
  get answer() {
    return this._answer;
  }
  set answer(answer: string) {
    this._answer = answer;
  }
  get timer() {
    return this._timer;
  }
  set timer(sec: number) {
    this._timer = sec;
  }
}

class Game {
  private _roomList: Room[];
  private _userList: User[];
  private _roomNumber: number = 1;
  constructor() {
    this._roomList = [];
    this._userList = [];
  }

  //방생성
  createRoom(id: string, title: string, maxUser: number, password: string) {
    this._roomList.push(new Room(id, title, maxUser, password, this._roomNumber++));
  }

  //방삭제
  deleteRoom(id: string) {
    this._roomList = this._roomList.filter((v) => v.id !== id);
  }

  //방존재여부 확인
  getRoomById(id: string) {
    return this._roomList.find((v) => v.id === id);
  }

  //유저 접속
  connectUser(data: User) {
    this._userList.push(data);
  }

  //유저 위치변경
  changeLocation(socket_id: string, location: string) {
    if (location !== 'main') {
      //접속한 방이 로비가 아닐경우
      const room = this.getRoomById(location);
      if (room) {
        //방이 유효할경우 사람을 넣어준다.
        const user = this._userList.find((v) => v.socket_id === socket_id);
        if (user)
          room.addUser({
            socket_id,
            current: user.current,
            nick: user.nick,
            profile: user.profile,
            status: 0,
            total: user.total,
          });
      }
    }
    const user = this._userList.find((v) => v.socket_id === socket_id);
    console.log(user);
    if (user) user.location = location;

    return user;
  }
  //유저 연결끊김
  disconnectUser(socket_id: string) {
    this._userList = this._userList.filter((v) => v.socket_id !== socket_id);
  }

  //방목록, 유저목록 반환
  getAlls() {
    return {
      rooms: this.roomList,
      users: this.userList,
    };
  }

  //방목록 반환
  get roomList() {
    return this._roomList.map((room) => room.infoForList());
  }

  //유저목록 반환
  get userList() {
    return this._userList;
  }
}

class Chat {
  type: string;
  user: string;
  location: string;
  msg: string;
  connected: boolean;

  constructor() {
    this.type = '';
    this.user = '';
    this.location = '';
    this.msg = '';
    this.connected = false;
  }

  joinRoom(socket_id: string, game, type: string, location: string) {
    const user: User = game.changeLocation(socket_id, location);
    this.type = type;
    this.user = user.nick;
    this.location = user.location;
    this.connected = true;
  }

  sendMessage(msg: string) {
    this.type = 'message';
    this.msg = msg;
  }
}

export { Game, Chat };
