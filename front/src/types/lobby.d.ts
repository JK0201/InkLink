interface MainType {
  show: number;
  profile: boolean;
  notice: boolean;
  chat: boolean;
  memberList: boolean;
}

interface ListType {
  room: boolean;
  best: boolean;
  shop: boolean;
}

interface DetailType {
  password: boolean;
  signOut: boolean;
  notice: boolean;
  user: boolean;
  room: boolean;
}

interface NoticeType {
  _id: string;
  type: string;
  title: string;
  content: string;
  date: string;
}

interface LobbyChatType {
  type: string;
  user: string;
  msg: string;
}

interface RoomInfoType {
  roomNumber: number;
  id: string;
  title: string;
  currentUser: number;
  maxUser: number;
  userList: string[];
  private: boolean;
  password: string;
  status: number;
}

interface RoomPassType {
  id: string;
  password: string;
}

interface IncomingDataType {
  rooms: RoomInfoType[];
  users: userData[];
}
