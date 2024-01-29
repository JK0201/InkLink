import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import style from './list.module.css';
import { detailModal, listModal, mainModal, refreshRoom } from '../../../../recoil/lobby';
import { useEffect, useState } from 'react';
import { closeHandler, modalHandler } from '../../../../api/modal';
import { newIncomingData, roomList, roomPassword } from '../../../../recoil/detail';
import { useNavigate } from 'react-router-dom';
import { socketAtom } from '../../../../recoil/socket';

function RoomList() {
  const [list, setList] = useRecoilState(listModal);
  const [main, setMain] = useRecoilState(mainModal);
  const [visible, setVisible] = useState<string>(style.d_hide);
  const [fade, setFade] = useState<string>(style.fade_out);
  const [detail, setDetail] = useRecoilState(detailModal);
  const [room, setRoom] = useRecoilState(roomList);
  const socket = useRecoilValue(socketAtom);
  const setRoomPass = useSetRecoilState(roomPassword);
  const navigate = useNavigate();
  const newData = useRecoilValue(newIncomingData);
  const [refreshRoomBtn, setRefreshRoomBtn] = useRecoilState(refreshRoom);

  useEffect(() => {
    modalHandler(style, list.room, setVisible, setFade);
  }, [list.room]);

  const closeModal = () => {
    setMain({ ...main, show: 0 });
    closeHandler(style, list, 'best', setList, setFade);
  };

  const createRoom = () => {
    setDetail({ ...detail, room: true });
  };

  const joinRoom = (idx: number) => {
    const { id, password } = room[idx];

    if (password) {
      setDetail({ ...detail, password: true });
      setRoomPass({ id, password });
    } else {
      socket?.emit('joinRequest', { id });
      socket?.on('enterRoom', (url) => {
        console.log(url);
        navigate(`/room/${url}`);
      });
    }

    return () => {
      socket?.off('enterRoom');
    };
  };

  const refreshRoomList = () => {
    setRefreshRoomBtn(false);
    let timer: NodeJS.Timeout;
    if (newData.rooms.length > 0) {
      setRoom(newData.rooms);
    }

    timer = setTimeout(() => {
      setRefreshRoomBtn(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  };

  return (
    <div className={`${style.list_box} ${visible} ${fade}`}>
      <div className={style.list_window}>
        <div className={style.list_header}>
          <div className={style.list_btn_box}>
            <div className={style.room_btn} onClick={createRoom}>
              방생성
            </div>
            <div className={style.room_btn}>퀵매칭</div>
            <div className={`${refreshRoomBtn ? style.room_btn : style.room_btn_disabled}`} onClick={refreshRoomList}>
              re
            </div>
          </div>
          <img
            className={style.close_btn}
            alt="close-btn"
            src={process.env.REACT_APP_BUCKET_URL + 'icons/close_btn_w.svg'}
            onClick={closeModal}
          />
        </div>
        <div className={style.input_grp_gutter}>
          <div className={style.input_group}>
            <img alt="search-icon" src={process.env.REACT_APP_BUCKET_URL + 'icons/search_icon.svg'} />
            <input type="text" placeholder="방제목을 입력해주세요." />
            <div className={style.search_btn}>방검색</div>
          </div>
        </div>
        <div className={style.list}>
          {room.map((item, idx) => {
            let roomNumber: number = item.roomNumber.toString().length;

            return (
              <div key={idx} className={style.list_item}>
                <div className={style.list_item_left}>
                  <div className={style.room_no}>
                    {roomNumber === 1
                      ? '00' + item.roomNumber
                      : roomNumber === 2
                      ? '0' + item.roomNumber
                      : item.roomNumber}
                  </div>
                  <div className={style.room_user}>
                    <img alt="user-icon" src={process.env.REACT_APP_BUCKET_URL + 'icons/user_icon.svg'} />
                    <p>
                      {item.currentUser}/{item.maxUser}
                    </p>
                  </div>
                </div>
                <div className={style.list_item_right}>
                  <div className={style.room_name}>
                    <p>{item.title}</p>
                    {item.password ? (
                      <img alt="user-icon" src={process.env.REACT_APP_BUCKET_URL + 'icons/lock_icon.svg'} />
                    ) : null}
                  </div>
                  <div className={style.room_status}>
                    {item.status === 0 ? (
                      <>
                        <p className={style.waiting}>WAITING</p>
                        <div className={style.enter_btn} onClick={() => joinRoom(idx)}>
                          입장
                        </div>
                      </>
                    ) : (
                      <>
                        <p className={style.playing}>PLAYING</p>
                        <div className={style.enter_btn} onClick={() => joinRoom(idx)}>
                          입장
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default RoomList;
