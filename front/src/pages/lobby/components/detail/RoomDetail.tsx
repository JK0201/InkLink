import React, { useEffect, useState } from 'react';
import style from './detail.module.css';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { detailModal } from '../../../../recoil/lobby';
import { roomInfo } from '../../../../recoil/detail';
import { socketAtom } from '../../../../recoil/socket';
import { userDataAtom } from '../../../../recoil/user';
import { useNavigate } from 'react-router-dom';

function RoomDetail() {
  const [room, setRoom] = useRecoilState(roomInfo);
  const resetRoom = useResetRecoilState(roomInfo);
  const [detail, setdetail] = useRecoilState(detailModal);
  const [visible, setVisible] = useState<string>('');
  const [hide, setHide] = useState<string>('d_hide');
  const socket = useRecoilValue(socketAtom);
  const userData = useRecoilValue(userDataAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (detail.room) {
      setVisible('fade_in');
      setHide('');
    }
  }, [detail.room]);

  const closeRoomCreator = () => {
    setdetail({ ...detail, room: false });
    setVisible('');
    setHide('d_hide');
    resetRoom();
  };

  const roomHandler = () => {
    if (!titleValid(room.title)) {
      console.log('제목 미입력');
      return;
    }

    if (!room.maxUser) {
      console.log('최대인원 미선택');
      return;
    }

    if (room.private && !passwordValid(room.password)) {
      console.log('비밀번호 미입력');
      return;
    }

    socket?.emit('createRoom', room);
    closeRoomCreator();

    socket?.on('enterRoom', (url) => {
      navigate(`/room/${url}`);
    });

    return () => {
      socket?.off('enterRoom');
    };
  };

  return (
    <div className={`detail_modal_bg ${visible}`}>
      <div className="detail_modal_box">
        <div className={`detail_modal ${hide}`}>
          <p className={style.room_title}>방제목</p>
          <input
            className={style.input_title}
            type="text"
            placeholder="특수문자 제외, 2글자 이상"
            value={room.title}
            onChange={(e) => {
              setRoom({ ...room, title: e.target.value });
            }}
            maxLength={15}
          />
          <p className={style.room_title}>상세설정</p>
          <div className={style.room_settings}>
            <div className={style.room_ppl}>
              <p className={style.setting_title}>최대인원</p>
              <select
                className={style.select}
                value={room.maxUser}
                onChange={(e) => {
                  setRoom({ ...room, maxUser: parseInt(e.target.value) });
                }}
              >
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
              </select>
            </div>
            <div className={style.room_password}>
              <p className={style.setting_title}>
                비밀번호
                <input
                  type="checkbox"
                  checked={room.private}
                  onChange={(e) => setRoom({ ...room, private: e.target.checked })}
                />
              </p>
              <input
                className={style.input_pass}
                type="password"
                placeholder="4~6자리 숫자입력"
                maxLength={6}
                disabled={room.private ? false : true}
                value={room.password}
                onChange={(e) => setRoom({ ...room, password: e.target.value })}
              />
            </div>
          </div>
          <div className={style.btn_box}>
            <div className={style.sign_out_btn} onClick={closeRoomCreator}>
              취소
            </div>
            <div className={`${style.sign_out_btn} ${style.btn_main}`} onClick={roomHandler}>
              확인
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function titleValid(title: string) {
  const titleChk = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ ]{2,15}$/;
  return titleChk.test(title);
}

function passwordValid(pass: string) {
  const passChk = /^[0-9]{4,6}$/;
  return passChk.test(pass);
}

export default RoomDetail;
