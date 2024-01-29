import { useRecoilState, useRecoilValue } from 'recoil';
import style from './detail.module.css';
import { detailModal } from '../../../../recoil/lobby';
import { useEffect, useState } from 'react';
import { userDetail } from '../../../../recoil/detail';

function MemberDetail() {
  const [detail, setdetail] = useRecoilState(detailModal);
  const user = useRecoilValue(userDetail);
  const [visible, setVisible] = useState<string>('');
  const [hide, setHide] = useState<string>('d_hide');

  useEffect(() => {
    if (detail.user) {
      setVisible('fade_in');
      setHide('');
    }
  }, [detail.user]);

  const userInfoHandler = () => {
    setdetail({ ...detail, user: false });
    setVisible('');
    setHide('d_hide');
  };

  return (
    <div className={`detail_modal_bg ${visible}`} onClick={userInfoHandler}>
      <div className="detail_modal_box">
        <div className={`detail_modal ${hide}`} onClick={(e) => e.stopPropagation()}>
          {/* <img
            alt="user_profile"
            src={process.env.REACT_APP_BUCKET_URL + user.profile}
            style={{ width: '15rem', height: '15rem' }}
          /> */}
          <p className={style.title}>{user.nick}</p>
          <div className={style.btn_box}>
            <div className={`${style.sign_out_btn} ${style.btn_main}`} onClick={userInfoHandler}>
              확인
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDetail;
