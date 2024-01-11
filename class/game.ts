import { Server, Socket } from "socket.io";


interface roomSetting {
    lang: number,       //0언어
    max: number;        //1최대인원
    limit: number;      //2제한시간
    round: number;      //3라운드
    useCustom: boolean; //4커스텀사용여부
    customs: string[];  //5커스텀목록
    hintType: number;   //6힌트타입(0밑줄,1숫자,2미표기)
    topicType: number;  //7주제선정(0가중치,1다수결,2방장,3무작위,4모두)
    owner: string;      //방장 소켓ID
}
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
<<<<<<< HEAD
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
=======
    private _id: string;
    private _title: string;
    private _password: string;
    private _setting: roomSetting = {
        lang: 0,
        max: 8,
        limit: 60,
        round: 3,
        useCustom: false,
        customs: [],
        owner: '',
        hintType: 0,
        topicType: 0
>>>>>>> fe6681da626f9f642fe7a311c76fa6f954f9e11b
    };
    private _status: number = 0;
    private _timer: number = 0;
    private _users: userInRoom[] = [];
    private _answer: string;
    private _roomNumber: number;

    constructor(
        id: string,
        title: string,
        maxUser: number,
        password: string,
        number: number,
    ) {
        this._id = id;
        this._title = title;
        this._password = password;
        this._setting.max = maxUser;
        this._roomNumber = number;
    }


    infoForList() {
        return {
            id: this._id,
            title: this._title,
            currentUser: this._users.length,
            maxUser: this._setting.max,
            password: this._password,
            status: this._status
        }
    }
    addUser(data: userInRoom) {
        this._users.push(data);
        if (this._users.length === 1) {
            this._setting.owner = data.socket_id;
        }
        // return this._users;
    }
    delUserBySocketID(socket_id: string) {
        this._users = this._users.filter(user => user.socket_id !== socket_id);
        return this._users.length;
    }
    changeSetting(socket_id, data: [number, any]) {
        if (socket_id !== this._setting.owner)
            return false;

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
            case 6:
                this._setting.hintType = data[1];
                break;
            case 7:
                this._setting.topicType = data[1];
                break;
        }
        return true;
    }
    canJoin() {
        return this._setting.max === -1 || this._setting.max > this._users.length;
    }
    get users() { return this._users; }
    get setting() { return this._setting; }
    get id() { return this._id; }
    get answer() { return this._answer };
    set answer(answer: string) { this._answer = answer; }
    get timer() { return this._timer; }
    set timer(sec: number) { this._timer = sec; }
}

class Game {
    private _roomList: Room[];
    private _userList: User[];
    private _roomNumber: number = 1;
    constructor() {
        this._roomList = [];
        this._userList = [];
        this.createRoom('main', '로비', 9, '');
        this.createRoom('test', '테스트', 8, '');
    }

    //방생성
    createRoom(id: string, title: string, maxUser: number, password: string) {
        this._roomList.push(new Room(id, title, maxUser, password, this._roomNumber++));
    }

    //방삭제
    deleteRoom(id: string) {
        this._roomList = this._roomList.filter(v => v.id !== id);
    }

    //방존재여부 확인
    getRoomById(id: string) {
        return this._roomList.find(v => v.id === id);
    }

    //유저 접속
    connectUser(data: User) {
        this._userList.push(data);
    }

    //유저 위치변경로직2
    changeLocation(io: Server, socket: Socket, location: string) {
        //방 전환 성공 : return true;
        //방 전환 실패 : return false;
        try {
            //유저 정보를 가져온다.
            const user = this._userList.find(v => v.socket_id === socket.id);
            //올바르지 않은 접근이면 false.
            if (!user) return false;
            //신규방이 유효한 방인지 확인
            const newRoom = this.getRoomById(location);
            if (newRoom && newRoom.canJoin()) {
                //기존 입장중인 방을 가져온다.
                const oldRoom = socket.rooms;
                //기존 방을 나가준다.
                oldRoom.forEach(v => {
                    //소켓 자체 방에서 나가주고
                    socket.leave(v);
                    const r = this.getRoomById(v);
                    if (r) {
                        //개별로 관리하는 목록에서도 나가준다.
                        r.delUserBySocketID(socket.id);
                        //모든 인원이 나갔으면 방을 삭제한다.
                        // if (r.users.length === 0) {
                        if (r.users.length === 0 && r.id !== 'test') { //테스트방이 아닐때만 삭제.
                            this.deleteRoom(v);
                        } else {
                            io.to(v).emit('leaveUser', user.nick);
                        }
                    }
                });
                //소켓 자체 join처리
                socket.join(location);

                //해당 방에 유저를 추가해주고
                newRoom.addUser({
                    socket_id: socket.id,
                    current: user.current,
                    nick: user.nick,
                    profile: user.profile,
                    status: 0,
                    total: user.total,
                });

                //접속정보에서도 위치를 바꿔준다.
                user.location = location;
                //그리고 들어옴 메세지를 보내준다.
                io.to(location).emit('postChat', {
                    type: 'enter',
                    user: user.nick,
                    msg: ''
                });

                //로비의 모두에게 최신화 시켜준다.
                io.to('main').emit('getListData', this.getAlls());
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    getNickBySocketID(socketID: string) {
        return this._userList.find(v => v.socket_id === socketID)?.nick || null;
    }

    //유저 연결끊김
    disconnectUser(io: Server, socketID: string) {
        //유저 정보를 가져온다.
        // const socket = io.sockets.sockets[socketID];

        const user = this._userList.find(v => v.socket_id === socketID);
        //올바르지 않은 접근이면 false.
        if (!user) return false;


        //유저가 접속해있던 위치에 관한 처리
        const oldRoom = user.location;
        const r = this.getRoomById(oldRoom);
        //개별로 관리하는 목록에서도 나가준다.
        r?.delUserBySocketID(socketID);
        io.to(oldRoom).emit('postChat', {
            type: 'leave',
            user: user.nick,
            msg: ''
        });

        //접속정보목록에서도 제거해준다.
        this._userList = this._userList.filter(v => v.socket_id !== socketID);
        //로비의 모두에게 최신화
        io.to('main').emit('getListData', this.getAlls());

    }
    whereAmI(socket_id: string) {
        //console.log(socket.rooms); {<socket-id>,'room'};
        /*
        const room = io.sockets.adapter.rooms[roomId];

        if (room && room.sockets) {
        // 해당 방에 속한 소켓들의 ID 목록을 얻을 수 있습니다.
        const socketsInRoom = Object.keys(room.sockets);
        console.log(`소켓이 ${roomId} 방에 속해있습니다. 소켓 ID 목록: ${socketsInRoom}`);
        } else {
        console.log(`소켓이 ${roomId} 방에 속해있지 않습니다.`);
        }
        */
        // const user = this._userList.find(v=>v.socket_id===socket_id);
        // return user?.location || null;
    }

    //방목록, 유저목록 반환
    getAlls() {
        return {
            rooms: this.roomList,
            users: this.userList
        }
    }

    //방목록 반환
    get roomList() {
        return this._roomList.map(room => room.infoForList());
    }

    //유저목록 반환
    get userList() {
        let result;
        result = this._userList.map(v => {
            return {
                nick: v.nick,
                profile: v.profile,
                total: v.total,
                location: v.location
            }
        });
        return result;
    }


}

export { Game };