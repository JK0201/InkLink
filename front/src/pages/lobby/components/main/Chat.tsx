import { useRecoilState, useRecoilValue } from 'recoil';
import style from './main.module.css';
import { mainModal } from '../../../../recoil/lobby';
import { useEffect, useRef, useState } from 'react';
import { closeHandler, modalHandler } from '../../../../api/modal';
import { lobbyChat } from '../../../../recoil/chat';
import { socketAtom } from '../../../../recoil/socket';

function Chat() {
  const [main, setMain] = useRecoilState(mainModal);
  const [visible, setVisible] = useState<string>(style.d_hide);
  const [fade, setFade] = useState<string>(style.fade_out);
  const socket = useRecoilValue(socketAtom);
  const [chat, setChat] = useRecoilState(lobbyChat);
  const msgRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && main.chat) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(()=>{
    console.log(chat);
  },[chat]);

  useEffect(() => {
    modalHandler(style, main.chat, setVisible, setFade);
  }, [main.chat]);

  const enterKeyHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      msgHandler();
    }
  };

  const msgHandler = () => {
    if (msgRef.current && msgRef.current.value.trim().length > 0) {
      socket?.emit('postChat', { msg: msgRef.current.value });
      msgRef.current.value = '';
    }
  };

  return (
    <div className={`${style.lg_box} ${style.mr_1} ${visible} ${fade}`}>
      <div className={style.close_btn}>
        <img
          alt="close-btn"
          src={process.env.REACT_APP_BUCKET_URL + 'icons/close_btn.svg'}
          onClick={() => closeHandler(style, main, 'chat', setMain, setFade)}
        />
      </div>
      <div className={style.detail_box_bottom}>
        <div className={style.detail}>
          <div className={style.chat_field} ref={scrollRef}>
            <div className={style.chat_content}>
              {chat.map((item, idx) => {
                return item.type === 'notice' ? (
                  <div key={idx} className={style.chat_notice}>
                    <span className={style.chat_enter_id}>{item.user}</span>
                    <span>{item.msg}</span>
                  </div>
                ) : item.type === 'enter' ? (
                  <div key={idx} className={style.chat_notice}>
                    <span className={style.chat_enter_id}>{item.user}</span>
                    <span>님이 입장하셨습니다.</span>
                  </div>
                ) : item.type === 'chat' ? (
                  <div key={idx} className={style.chat_msg}>
                    <span className={style.chat_id}>{item.user}</span>
                    <span>: {item.msg}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
        <div className={style.chat_input_group}>
          <input type="text" maxLength={60} ref={msgRef} onKeyUp={enterKeyHandler} />
          <div className={style.chat_send_btn} onClick={msgHandler}>
            <img alt="send-btn" src={process.env.REACT_APP_BUCKET_URL + 'icons/send_icon.svg'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
