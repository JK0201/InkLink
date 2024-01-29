import './lobby.css';
import { Header, Footer, LobbyMain, BgDesktop, BgMobile, SignOut, NoticeDetail, UserDetail, Password } from './index';
import MediaQuery from 'react-responsive';
import { mobileModal } from '../../recoil/lobby';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { socketAtom } from '../../recoil/socket';
import { userStatusAtom } from '../../recoil/user';
import { newIncomingData, noticeList, roomList } from '../../recoil/detail';
import RoomDetail from './components/detail/RoomDetail';
import axios from 'axios';

function Lobby() {
  const socket = useRecoilValue(socketAtom);
  const setMenu = useSetRecoilState(mobileModal);
  const setStatus = useSetRecoilState(userStatusAtom);
  const setRoom = useSetRecoilState(roomList);
  const [notice, setNotice] = useRecoilState(noticeList);
  const [loading, setLoading] = useState<boolean>(false);
  const setNewData = useSetRecoilState(newIncomingData);

  useEffect(() => {
    axios({
      method: 'GET',
      url: '/api/lobby/notice',
    })
      .then((res) => {
        setNotice(res.data?.notice);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    socket?.on('initData', (data) => {
      setStatus(data.users);
      setRoom(data.rooms);
    });

    let timer = setTimeout(() => {
      if (socket && notice.length > 0) {
        setLoading(true);
      }
    }, 1000);

    return () => {
      socket?.off('initData');
      clearTimeout(timer);
    };
  }, [socket, notice]);

  useEffect(() => {
    socket?.on('getListData', (data) => {
      setNewData(data);
    });
  }, [socket]);

  const mobileMenuHandler = () => {
    setMenu(false);
  };

  return (
    <>
      {loading ? (
        <div className="lobby">
          <Password />
          <NoticeDetail />
          <UserDetail />
          <SignOut />
          <RoomDetail />
          <Header />
          {/* <MediaQuery query="(min-width:768px) and (min-height: 768px)">
          <BgDesktop />
        </MediaQuery>
        <MediaQuery query="(max-width:767.99px) or (max-height: 767.99px)">
          <BgMobile />
        </MediaQuery> */}
          <div className="lobby_main_box" onClick={mobileMenuHandler}>
            <LobbyMain />
          </div>
          <Footer />
        </div>
      ) : (
        '로딩 페이지를 만들것이와'
      )}
    </>
  );
}

export default Lobby;
