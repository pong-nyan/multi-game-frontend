import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import DrawableBall from '../../../objects/DrawableBall';
import { Ball } from '../../../interfaces/Ball';
import { io as socketIOClient, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

export default function Run({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>();
  const ballsRef = useRef<DrawableBall[]>();
  const requestRef = useRef<number>();
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();

  const sendGameEvent = (e: KeyboardEvent) => {
    if (!socketRef.current) return;
    socketRef.current.emit('game', { keyCode: e.key });
  };

  const initGame = () => {
    console.log('init game all');
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctxRef.current = ctx;
    socketRef.current = socketIOClient('http://localhost:4242');
    socketRef.current.on('balls', (balls: Ball[]) => {
      ballsRef.current = balls.map((ball) => new DrawableBall(ball.id, ball.x, ball.y, ball.radius, ball.color));
    });

    window.addEventListener('keydown', sendGameEvent);
  };

  const renderCanvas = () => {
    if (!canvasRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (ballsRef.current) {
      ballsRef.current.forEach((ball) => {
        ball.draw(ctx);
      });
    }
    requestRef.current = requestAnimationFrame(renderCanvas);
  };

  useEffect(() => {
    initGame();
    requestRef.current = requestAnimationFrame(renderCanvas);

    return () => {
      if (!requestRef.current) return;
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('keydown', sendGameEvent);
    };
  });

  return (
  // TODO: width and height should be defined in a config file
    <canvas width={1280} height={720} ref={canvasRef}>
			Canvas
    </canvas>
  );
}