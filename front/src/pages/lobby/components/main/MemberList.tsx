import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import style from './main.module.css';
import { detailModal, mainModal, refreshUser } from '../../../../recoil/lobby';
import { useEffect, useState } from 'react';
import { closeHandler, modalHandler } from '../../../../api/modal';
import { userStatusAtom } from '../../../../recoil/user';
import { newIncomingData, userDetail } from '../../../../recoil/detail';

function MemberList() {
  const [main, setMain] = useRecoilState(mainModal);
  const [visible, setVisible] = useState<string>(style.d_hide);
  const [fade, setFade] = useState<string>(style.fade_out);
  const [detail, setDetail] = useRecoilState(detailModal);
  const setUser = useSetRecoilState(userDetail);
  const [status, setStatus] = useRecoilState(userStatusAtom);
  const newData = useRecoilValue(newIncomingData);
  const [refreshUserBtn, setRefreshUserBtn] = useRecoilState(refreshUser);

  useEffect(() => {
    modalHandler(style, main.memberList, setVisible, setFade);
  }, [main.memberList]);

  const userInfoHandler = (item: userData) => {
    console.log(item);
    setDetail({ ...detail, user: true });
    setUser(item);
  };

  const refreshUserList = () => {
    setRefreshUserBtn(false);
    let timer: NodeJS.Timeout;
    if (newData.users.length > 0) {
      setStatus(newData.users);
    }

    timer = setTimeout(() => {
      setRefreshUserBtn(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  };

  return (
    <div className={`${style.sm_box} ${style.ml_1} ${visible} ${fade}`}>
      <div className={style.close_btn}>
        <img
          alt="close-btn"
          src={process.env.REACT_APP_BUCKET_URL + 'icons/close_btn.svg'}
          onClick={() => closeHandler(style, main, 'memberList', setMain, setFade)}
        />
      </div>
      <div className={style.detail_box_bottom}>
        <div className={style.detail}>
          <div className={style.member_window}>
            <div className={style.member_nickname_col}>닉네임</div>
            <div className={style.member_score}>점수</div>
            <div className={style.member_location}>위치</div>
          </div>
          <div className={style.member_detail}>
            <div className={style.input_grp_gutter}>
              <div className={style.input_group}>
                <img alt="search-icon" src={process.env.REACT_APP_BUCKET_URL + 'icons/search_icon.svg'} />
                <input type="text" placeholder="닉네임을 입력해주세요." />
                <div className={style.search_btn}>검색</div>
                <div
                  className={`${refreshUserBtn ? style.user_btn : style.user_btn_disabled}`}
                  onClick={refreshUserList}
                >
                  re
                </div>
              </div>
            </div>
            {status.map((item, idx) => {
              return (
                <div key={idx} className={`${style.member_list} ${idx % 2 === 0 ? '' : style.bg_gray}`}>
                  <div className={style.member_nickname} onClick={() => userInfoHandler(item)}>
                    {item.nick}
                  </div>
                  <div className={style.member_score}>{item.total}</div>
                  <div className={style.member_location}>
                    {item.location === 'main' ? '로비' : item.roomNumber + '번방'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberList;
