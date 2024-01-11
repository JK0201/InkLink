import React, { useRef } from 'react';
import style from './Popup.module.css';
import { useRecoilValue } from 'recoil';
import { socketAtom } from '../../../recoil/socket';
const Popup2 = () => {
    const socket = useRecoilValue(socketAtom);
    const customWordsRef = useRef<HTMLTextAreaElement>(null);
    const emitSetting = (type: number, value: any) => {
        if(type===4){
            value = Number(value) ? true : false;
            if(customWordsRef.current)
            customWordsRef.current.disabled = !value;
        }
        socket?.emit('changeSetting', { type, value });
        console.log(type, value);
    }
    const startGame = () =>{
        if(0){
            //인원수 미달
            alert('최소 2명이상이여야 시작 할 수 있습니다.');
            return;
        }
        let custom = customWordsRef.current!.value.split(',').map(word => word.trim()).filter(word => word !== '');
        console.log(JSON.stringify(custom));
    }

    return (
        <div className={style.optionWrapper}>
            <div className={style.options}>
                <div>최대 라운드</div>
                <select defaultValue={3} onChange={(e) => { emitSetting(3, e.target.value) }}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </div>
            <div className={style.options}>
                <div>라운드당 제한시간</div>
                <select defaultValue={45} onChange={(e) => { emitSetting(2, e.target.value) }}>
                    <option>15</option>
                    <option>30</option>
                    <option>45</option>
                    <option>60</option>
                    <option>75</option>
                    <option>90</option>
                    <option>105</option>
                    <option>120</option>
                </select>
            </div>
            <div className={style.options}>
                <div>글자수 표시 방식</div>
                <div className={style.hint}>
                    <input onChange={(e)=>{emitSetting(6,e.target.value);}} type='radio' name='hint' id='hint1' value={0} defaultChecked />
                    <label className={style.lbl} htmlFor='hint1'>밑줄로 표시</label>
                    <input onChange={(e) => { emitSetting(6, e.target.value); }} type='radio' name='hint' id='hint2' value={1} />
                    <label className={style.lbl} htmlFor='hint2'>숫자로 표시</label>
                    <input onChange={(e) => { emitSetting(6, e.target.value); }} type='radio' name='hint' id='hint3' value={2} />
                    <label className={style.lbl} htmlFor='hint3'>표시 안함</label>
                </div>
            </div>
            <div className={style.options}>
                <div>주제 선정 방식</div>
                <div>
                    <input onChange={(e) => { emitSetting(7, e.target.value); }} type='radio' name='topic' id='topic1' value={0} defaultChecked />
                    <label className={style.lbl} htmlFor='topic1'>가중치 투표</label>
                    <input onChange={(e) => { emitSetting(7, e.target.value); }} type='radio' name='topic' id='topic2' value={1} />
                    <label className={style.lbl} htmlFor='topic2'>다수결 투표</label>
                    <input onChange={(e) => { emitSetting(7, e.target.value); }} type='radio' name='topic' id='topic3' value={2} />
                    <label className={style.lbl} htmlFor='topic3'>방장 선택</label>
                    <input onChange={(e) => { emitSetting(7, e.target.value); }} type='radio' name='topic' id='topic4' value={3} />
                    <label className={style.lbl} htmlFor='topic4'>무작위 선정</label>
                    <input onChange={(e) => { emitSetting(7, e.target.value); }} type='radio' name='topic' id='topic5' value={4} />
                    <label className={style.lbl} htmlFor='topic5'>모든 주제</label>
                </div>
            </div>
            <div className={`${style.options} ${style.customOption}`}>
                <div>
                    <div>사용자 정의 단어장</div>
                    <div>
                        <input onChange={(e) => { emitSetting(4, e.target.value); }} type='radio' name='custom' id='custom1' value={1} />
                        <label className={style.lbl} htmlFor='custom1'>사용</label>
                        <input onChange={(e) => { emitSetting(4, e.target.value); }} type='radio' name='custom' id='custom2' value={0} defaultChecked />
                        <label className={style.lbl} htmlFor='custom2'>미사용</label>
                    </div>
                </div>
                <textarea ref={customWordsRef} rows={1} placeholder=', (쉼표)로 구분하여 최대 1000글자, 100단어까지 입력 가능' maxLength={1000} disabled></textarea>
            </div>
            <button className={style.button} onClick={startGame}>
                게임 시작
            </button>

        </div>
    );
};

export default Popup2;