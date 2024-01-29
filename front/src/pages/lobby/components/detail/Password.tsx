import { useRecoilState, useRecoilValue } from 'recoil';
import style from './detail.module.css';
import { useEffect, useRef, useState } from 'react';
import { detailModal } from '../../../../recoil/lobby';
import { roomPassword } from '../../../../recoil/detail';
import { socketAtom } from '../../../../recoil/socket';
import { useNavigate } from 'react-router-dom';

function Password() {
  const [detail, setdetail] = useRecoilState(detailModal);
  const [visible, setVisible] = useState<string>('');
  const [hide, setHide] = useState<string>('d_hide');
  const roomPass = useRecoilValue(roomPassword);
  const passRef = useRef<HTMLInputElement>(null);
  const socket = useRecoilValue(socketAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (detail.password) {
      setVisible('fade_in');
      setHide('');
    }
  }, [detail.password]);

  const passwordHandler = () => {
    if (passRef.current) {
      passRef.current.value = '';
    }

    setdetail({ ...detail, password: false });
    setVisible('');
    setHide('d_hide');
  };

  class PassBtn {
    value: string;
    color: number;

    constructor() {
      this.value = '';
      this.color = 0;
    }

    render(value: string, color: number) {
      this.value = value;
      this.color = color;

      return (
        <div
          key={this.value}
          className={`${style.password_btn} ${color === 1 ? style.btn_main : ''}`}
          onClick={() => btnHandler(value)}
        >
          {this.value}
        </div>
      );
    }
  }

  const btn = new PassBtn();

  function shuffle(array: any[]) {
    array.sort(() => Math.random() - 0.5);
    return array;
  }

  const createBtn = (min: number, max: number) => {
    let elements = [];
    let rowElements = [];

    for (let i = min; i <= max; i++) {
      const color = i % 2 === 0 ? 1 : 0;
      rowElements.push(btn.render(`${i}`, color));
      shuffle(rowElements);
    }

    for (let i = 0; i < rowElements.length; i += 3) {
      elements.push(
        <div key={`row-${i / 3}`} className={style.btn_pass_box}>
          {rowElements.slice(i, i + 3)}
        </div>
      );
    }
    return elements;
  };

  const btnHandler = (value: string) => {
    if (value === '취소') {
      passwordHandler();
      return;
    }

    if (value === '확인') {
      if (passRef.current) {
        if (!passwordValid(passRef.current.value)) {
          return;
        }

        if (roomPass.password === passRef.current.value) {
          socket?.emit('joinRequest', { id: roomPass.id, password: passRef.current.value });
          socket?.on('enterRoom', (url) => {
            console.log(url);
            navigate(`/room/${url}`);
          });
        } else {
          alert('비밀번호를 확인해주세요.');
          passRef.current.value = '';
        }
      }
      return;
    }

    if (passRef.current) {
      if (passRef.current.value.length >= 6) {
        return;
      }
      passRef.current.value = passRef.current.value + value;
    }

    return () => {
      socket?.off('enterRoom');
    };
  };

  return (
    <div className={`detail_modal_bg ${visible}`} onClick={passwordHandler}>
      <div className="detail_modal_box">
        <div className={`detail_modal ${hide}`} onClick={(e) => e.stopPropagation()}>
          <p className={`${style.title} ${style.c_black}`}>Q. 비밀번호를 입력해주세요</p>
          <input className={style.pass_input} type="text" ref={passRef} placeholder="4~6자리"></input>
          {createBtn(1, 9)}
          <div className={style.btn_pass_box}>
            {btn.render('취소', 0)}
            {btn.render('0', 0)}
            {btn.render('확인', 0)}
          </div>
        </div>
      </div>
    </div>
  );
}

function passwordValid(pass: string) {
  const passChk = /^[0-9]{4,6}$/;
  return passChk.test(pass);
}

export default Password;
