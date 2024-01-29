import { atom } from 'recoil';

const userDataAtom = atom<userData>({
  key: 'userDataAtom',
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

const userStatusAtom = atom<userData[]>({
  key: 'userStatusAtom',
  default: [],
});

const needLoginAtom = atom<boolean>({
  key: 'needLoginAtom',
  default: true,
});

const socketVerifyCodeAtom = atom<string>({
  key: 'socketVerifyCodeAtom',
  default: '',
});

export { userDataAtom, userStatusAtom, needLoginAtom, socketVerifyCodeAtom };
