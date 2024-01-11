"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var Room = /** @class */ (function () {
    function Room(id, title, maxUser, password, number) {
        this._setting = {
            lang: 0,
            max: 8,
            limit: 60,
            round: 3,
            useCustom: false,
            customs: [],
            owner: '',
            hintType: 0,
            topicType: 0
        };
        this._status = 0;
        this._timer = 0;
        this._users = [];
        this._id = id;
        this._title = title;
        this._password = password;
        this._setting.max = maxUser;
        this._roomNumber = number;
    }
    Room.prototype.infoForList = function () {
        return {
            id: this._id,
            roomNumber: this._roomNumber,
            title: this._title,
            currentUser: this._users.length,
            maxUser: this._setting.max,
            password: this._password,
            status: this._status
        };
    };
    Room.prototype.addUser = function (data) {
        this._users.push(data);
        if (this._users.length === 1) {
            this._setting.owner = data.socket_id;
        }
        // return this._users;
    };
    Room.prototype.delUserBySocketID = function (socket_id) {
        this._users = this._users.filter(function (user) { return user.socket_id !== socket_id; });
        return this._users.length;
    };
    Room.prototype.changeSetting = function (socket_id, data) {
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
    };
    Room.prototype.canJoin = function () {
        return this._setting.max === -1 || this._setting.max > this._users.length;
    };
    Object.defineProperty(Room.prototype, "users", {
        get: function () { return this._users; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "setting", {
        get: function () { return this._setting; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "id", {
        get: function () { return this._id; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "answer", {
        get: function () { return this._answer; },
        set: function (answer) { this._answer = answer; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Room.prototype, "timer", {
        get: function () { return this._timer; },
        set: function (sec) { this._timer = sec; },
        enumerable: false,
        configurable: true
    });
    return Room;
}());
var Game = /** @class */ (function () {
    function Game() {
        this._roomNumber = 1;
        this._roomList = [];
        this._userList = [];
        this.createRoom('main', '로비', 9, '');
        this.createRoom('test', '테스트', 8, '');
    }
    //방생성
    Game.prototype.createRoom = function (id, title, maxUser, password) {
        this._roomList.push(new Room(id, title, maxUser, password, this._roomNumber++));
    };
    //방삭제
    Game.prototype.deleteRoom = function (id) {
        this._roomList = this._roomList.filter(function (v) { return v.id !== id; });
    };
    //방존재여부 확인
    Game.prototype.getRoomById = function (id) {
        return this._roomList.find(function (v) { return v.id === id; });
    };
    //유저 접속
    Game.prototype.connectUser = function (data) {
        this._userList.push(data);
    };
    //유저 위치변경로직2
    Game.prototype.changeLocation = function (io, socket, location) {
        var _this = this;
        //방 전환 성공 : return true;
        //방 전환 실패 : return false;
        try {
            //유저 정보를 가져온다.
            var user_1 = this._userList.find(function (v) { return v.socket_id === socket.id; });
            //올바르지 않은 접근이면 false.
            if (!user_1)
                return false;
            //신규방이 유효한 방인지 확인
            var newRoom = this.getRoomById(location);
            if (newRoom && newRoom.canJoin()) {
                //기존 입장중인 방을 가져온다.
                var oldRoom = socket.rooms;
                //기존 방을 나가준다.
                oldRoom.forEach(function (v) {
                    //소켓 자체 방에서 나가주고
                    socket.leave(v);
                    var r = _this.getRoomById(v);
                    if (r) {
                        //개별로 관리하는 목록에서도 나가준다.
                        r.delUserBySocketID(socket.id);
                        //모든 인원이 나갔으면 방을 삭제한다.
                        // if (r.users.length === 0) {
                        if (r.users.length === 0 && r.id !== 'test') { //테스트방이 아닐때만 삭제.
                            _this.deleteRoom(v);
                        }
                        else {
                            io.to(v).emit('leaveUser', user_1.nick);
                        }
                    }
                });
                //소켓 자체 join처리
                socket.join(location);
                //해당 방에 유저를 추가해주고
                newRoom.addUser({
                    socket_id: socket.id,
                    current: user_1.current,
                    nick: user_1.nick,
                    profile: user_1.profile,
                    status: 0,
                    total: user_1.total,
                });
                //접속정보에서도 위치를 바꿔준다.
                user_1.location = location;
                //그리고 들어옴 메세지를 보내준다.
                io.to(location).emit('postChat', {
                    type: 'enter',
                    user: user_1.nick,
                    msg: ''
                });
                //로비의 모두에게 최신화 시켜준다.
                io.to('main').emit('getListData', this.getAlls());
                return true;
            }
            return false;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    };
    Game.prototype.getNickBySocketID = function (socketID) {
        var _a;
        return ((_a = this._userList.find(function (v) { return v.socket_id === socketID; })) === null || _a === void 0 ? void 0 : _a.nick) || null;
    };
    //유저 연결끊김
    Game.prototype.disconnectUser = function (io, socketID) {
        //유저 정보를 가져온다.
        var user = this._userList.find(function (v) { return v.socket_id === socketID; });
        //올바르지 않은 접근이면 false.
        if (!user)
            return false;
        //유저가 접속해있던 위치에 관한 처리
        var oldRoom = user.location;
        var r = this.getRoomById(oldRoom);
        //개별로 관리하는 목록에서도 나가준다.
        r === null || r === void 0 ? void 0 : r.delUserBySocketID(socketID);
        io.to(oldRoom).emit('postChat', {
            type: 'leave',
            user: user.nick,
            msg: ''
        });
        //접속정보목록에서도 제거해준다.
        this._userList = this._userList.filter(function (v) { return v.socket_id !== socketID; });
        //로비의 모두에게 최신화
        io.to('main').emit('getListData', this.getAlls());
    };
    Game.prototype.whereAmI = function (socket_id) {
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
    };
    //방목록, 유저목록 반환
    Game.prototype.getAlls = function () {
        return {
            rooms: this.roomList,
            users: this.userList
        };
    };
    Object.defineProperty(Game.prototype, "roomList", {
        //방목록 반환
        get: function () {
            return this._roomList.map(function (room) { return room.infoForList(); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "userList", {
        //유저목록 반환
        get: function () {
            var result;
            result = this._userList.map(function (v) {
                return {
                    nick: v.nick,
                    profile: v.profile,
                    total: v.total,
                    location: v.location
                };
            });
            return result;
        },
        enumerable: false,
        configurable: true
    });
    return Game;
}());
exports.Game = Game;
