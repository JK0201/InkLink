import { useRecoilState, useRecoilValue } from 'recoil';
import style from './detail.module.css';
import { useEffect, useState } from 'react';
import { detailModal } from '../../../../recoil/lobby';
import { noticeDetail } from '../../../../recoil/detail';

function NoticeDetail() {
  const [detail, setdetail] = useRecoilState(detailModal);
  const notice = useRecoilValue(noticeDetail);
  const [visible, setVisible] = useState<string>('');
  const [hide, setHide] = useState<string>('d_hide');

  useEffect(() => {
    if (detail.notice) {
      setVisible('fade_in');
      setHide('');
    }
  }, [detail.notice]);

  const noticeHandler = () => {
    setdetail({ ...detail, notice: false });
    setVisible('');
    setHide('d_hide');
  };

  return (
    <div className={`detail_modal_bg ${visible}`} onClick={noticeHandler}>
      <div className="detail_modal_box">
        <div className={`detail_modal ${hide}`} onClick={(e) => e.stopPropagation()}>
          <p className={style.title}>[{notice.type}]</p>
          <div className={style.btn_box}>
            <div className={style.sign_out_btn} onClick={noticeHandler}>
              취소
            </div>
            <div className={`${style.sign_out_btn} ${style.btn_main}`}>확인</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticeDetail;
