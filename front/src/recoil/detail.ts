import { atom } from 'recoil';

const noticeList = atom<NoticeType[]>({
  key: 'noticeList',
  default: [],
});

const noticeDetail = atom<NoticeType>({
  key: 'noticeDetail',
  default: {
    _id: '',
    type: '',
    title: '',
    content: '',
    date: '',
  },
});

const userDetail = atom<userData>({
  key: 'userDetail',
  default: {
    socket_id: '',
    nick: '',
    email: '',
    total: 0,
    current: 0,
    profile: '',
    role: 0,
    item: [],
    location: '',
    roomNumber: 0,
  },
});

const roomInfo = atom<RoomInfoType>({
  key: 'roomInfo',
  default: {
    roomNumber: 0,
    id: '',
    title: '',
    currentUser: 0,
    maxUser: 8,
    userList: [],
    private: false,
    password: '',
    status: 0,
  },
});

const roomList = atom<RoomInfoType[]>({
  key: 'roomList',
  default: [],
});

const roomPassword = atom<RoomPassType>({
  key: 'roomPassword',
  default: {
    id: '',
    password: '',
  },
});

const newIncomingData = atom<IncomingDataType>({
  key: 'newIncomingData',
  default: {
    rooms: [],
    users: [],
  },
});

export { noticeList, noticeDetail, userDetail, roomInfo, roomList, roomPassword, newIncomingData };
