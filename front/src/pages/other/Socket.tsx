import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { socketAtom } from '../../recoil/socket';
import { io } from 'socket.io-client';
import { socketVerifyCodeAtom, userDataAtom } from '../../recoil/user';
import { useNavigate } from 'react-router-dom';

const Socket = () => {
    const [pos, setPos] = useState<string>();
    const [socket, setSocket] = useRecoilState(socketAtom);
    const [code, setCode] = useRecoilState(socketVerifyCodeAtom);
    const [userData, setUserData] = useRecoilState(userDataAtom);
    const navi = useNavigate();
    useEffect(() => {
        const path = window.location.pathname.trim().split("/");
        if (code.length > 1) {
            const i = io('http://localhost:2320/', {
                query: {
                    eong: code,
                    location: path[2] || 'main'
                }
            });
            
            i.on('initSocket', (data) => {
                setUserData(v => ({ ...v, socket_id: data.id, location: data.loc }));
                if (path[2] && (path[2] !== data.loc)) {
                    alert('존재하지 않는 방입니다.');
                    navi('/');
                }
            });
            i.on('disconnect', () => {
                alert('서버와의 연결이 끊어졌습니다. 다시 로그인해주세요.');
            });
            setSocket(i);
            setCode('');
        }
    }, [code]);

    return null;
};

export default Socket;