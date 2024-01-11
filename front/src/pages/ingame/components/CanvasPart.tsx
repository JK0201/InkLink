import React, { useEffect, useRef, useState } from 'react';
import style from './CanvasPart.module.css';
import CanvasToolbar from './CanvasToolbar';
import Popup1 from './Popup1';
import { useRecoilState } from 'recoil';
import { canvasStateAtom } from '../../../recoil/canvas';
import { CanvasLogs, c2h, floodFill } from '../../../api/canvas';
import Popup2 from './Popup2';


const CanvasPart = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cs, setCS] = useRecoilState(canvasStateAtom);
    const [cvLogs, setCvLogs] = useState<CanvasLogs>();
    const drawingData = useRef<any>([]);
    
    useEffect(() => {

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        const flushData = setInterval(()=>{
            if(drawingData.current.length>0){
                console.log(JSON.stringify(drawingData.current));
                drawingData.current.length = 0;
            }
        },50);

        return () => {
            clearInterval(flushData);
        }

    }, []);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        ctx.strokeStyle = cs.color;
        // ctx.globalAlpha = 0.1;//cs.alpha;
        ctx.lineWidth = cs.lineWidth;
    }, [cs]);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        switch (cs.tool) {
            case 0:
                ctx.globalCompositeOperation = 'source-over';
                break;
            case 1:
                ctx.globalCompositeOperation = 'destination-out';
                break;
            case 2:
                break;
            case 3:
                ctx.clearRect(0, 0, 800, 600);
                setCS({ ...cs, tool: 0 });
                cvLogs?.logDrawing();
                // cvLogs?.clearLogs();
                break;
            default:
                break;
        }
    }, [cs.tool])
    useEffect(() => {
        if (canvasRef.current)
            setCvLogs(new CanvasLogs(canvasRef.current));
    }, [canvasRef])

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d')!;
        if (ctx)
            if (!cs.isDrawing) {
                cvLogs?.logDrawing();
                // ctx.closePath();
            }
    }, [cs.isDrawing])

    const pushDrawingData = (data:any) =>{
        drawingData.current.push(data);
        //[0,[툴,[데이터]]]
        //붓 : [0,[0,[0,x,y,color,width]]]
        //붓2: [0,[0,[1,x,y,color,width]]]
        //지 : [0,[1,[0,x,y]]]
        //지2: [0,[1,[1,x,y]]]
        //통 : [0,[2,[x,y,color,width]]]
        //텅 : [0,[3]]
        
    }

    const startDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent) => {
        e.preventDefault();
        if (!cs.myTurn) return;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        if (e.nativeEvent instanceof MouseEvent) {
            //마우스 클릭
            const { offsetX, offsetY } = e.nativeEvent;
            const ratio = canvas.clientWidth / canvas.width;
            const x = offsetX / ratio;
            const y = offsetY / ratio;
            if (cs.tool === 2) {
                pushDrawingData([x, y, cs.color, cs.lineWidth, cs.tool]);
                // data.push();
                // console.log(data.length);
                // console.log(data.length);
                floodFill(ctx, x, y, c2h(cs.color));
                cvLogs?.logDrawing();
            } else {
                pushDrawingData([0,[x, y, cs.color, cs.lineWidth, cs.tool]]);
                // alert('dd');
                ctx.beginPath();
                ctx.moveTo(x, y);
                setCS({
                    ...cs,
                    isDrawing: true
                });

            }
        } else {
            //TODO : 터치
            if (cs.tool === 2) {
                // const { clientX, clientY } = e.nativeEvent.touches[0];
                // floodFill(ctx, clientX, clientY, c2h(cs.color));
            } else {
                setCS({ ...cs, isDrawing: true });
            }
        }
    };
    const stopDraw = () => setCS({
        ...cs,
        isDrawing: false
    });
    const handleMouseOut = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        stopDraw();
    }
    const handleMouseEnter = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!cs.myTurn) return;
        if (e.buttons === 1) {
            setCS({
                ...cs, isDrawing: true
            })
        }
    }
    const doDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent) => {
        if (!cs.myTurn || !cs.isDrawing) return;
        e.preventDefault();
        let offsetX: number, offsetY: number;
        if (e.nativeEvent instanceof MouseEvent) {
            offsetX = e.nativeEvent.offsetX;
            offsetY = e.nativeEvent.offsetY;
        } else {
            offsetX = e.nativeEvent.touches[0].clientX;
            offsetY = e.nativeEvent.touches[0].clientY;
        }

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        const ratio = canvas.clientWidth / canvas.width;
        const x = offsetX / ratio;
        const y = offsetY / ratio;
        
        pushDrawingData([1, x, y, cs.color, cs.lineWidth, cs.tool]);
        ctx.lineTo(x, y);
        ctx.stroke();

    }

    const undo = async () => {
        await cvLogs?.undo();
    }
    const redo = async () => {
        await cvLogs?.redo();
    }



    return (
        <div className={style.wrapper}>
            {/* <Popup1/> */}
            <Popup2/>
            <canvas className={style.canvas} width={800} height={600} ref={canvasRef}
                onMouseDown={startDraw}
                onMouseUp={stopDraw}
                onMouseMove={doDraw}
                onMouseEnter={handleMouseEnter}
                onMouseOut={handleMouseOut}
                onTouchStart={startDraw}
                onTouchMove={doDraw}
                onTouchEnd={stopDraw}
                onTouchCancel={stopDraw}
                onPointerDown={(e) => { }}
                onContextMenu={(e) => { e.preventDefault(); }} />
            <CanvasToolbar a={undo} b={redo} />
        </div>
    );
};

export default CanvasPart;