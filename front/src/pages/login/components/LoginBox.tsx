import React, { useState } from 'react';
import style from './LoginBox.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { socketVerifyCodeAtom, userDataAtom } from '../../../recoil/user';

const LoginBox = () => {
    const navi = useNavigate();
    const setUserData = useSetRecoilState(userDataAtom);
    const [inputs, setInputs] = useState({
        id: '',
        pw: '',
    });
    const setCode = useSetRecoilState(socketVerifyCodeAtom);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let data = e.target.value;
        if (e.target.name === 'id')
            data = e.target.value.trim();
        setInputs({
            ...inputs,
            [e.target.name]: data
        });
    }

    const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (inputs.id.length > 0 && inputs.pw.length > 0) {
            axios.post('/api/login', { inputs }).then(res => {
                try {
                    setUserData(res.data.data);
                    setCode(res.data.eong);
                } catch {
                    alert('로그인에 실패하였습니다. 다시 시도하여 주세요.');
                }
            }).catch(res => {
                alert(res.response.data.msg);
            });
        }
    }
    const handleGuest = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        axios.post('/api/loginguest').then(res=>{
            try{
                setUserData(res.data.data);
                setCode(res.data.eong);
            }catch{
                alert('접속에 실패하였습니다. 다시 시도하여 주세요.');
            }
        }).catch(res=>{
            alert(res.response?.data?.msg || "오류가 발생하였습니다.");
        });
    }

    return (
        <li>
            <div className={style.up}>
                <input className={style.input} placeholder='아이디'
                    name='id' onChange={handleChange} lang='en' autoFocus/>
                <input type='password' className={style.input} placeholder='비밀번호'
                    name='pw' onChange={handleChange} />
                <button className={style.btnLogin} onClick={handleSignIn}>로그인</button>
            </div>
            <button className={style.btnGuest} onClick={handleGuest}>
                비회원으로 게임하기
            </button>
        </li>
    );
};

export default LoginBox;