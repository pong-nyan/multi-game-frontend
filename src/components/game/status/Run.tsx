import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Ball from "../../../objects/Ball";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";
import { io as socketIOClient, Socket } from "socket.io-client";
import { getEventListeners } from "events";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export default function Run({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const ctxRef = useRef<CanvasRenderingContext2D | null>()
	const ballRef = useRef<Ball>()
	const requestRef = useRef<number>()
	const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>()

	const sendGameEvent = (e: KeyboardEvent) => {
		if (!socketRef.current) return
		socketRef.current.emit('game', { keyCode: e.key })
	}
	const initGame = () => {
		console.log('init game all');
		if (!canvasRef.current) return
		const ctx = canvasRef.current.getContext('2d')
		ctxRef.current = ctx
		socketRef.current = socketIOClient('http://localhost:4242')
		window.addEventListener('keydown', sendGameEvent)
	}

	const renderCanvas = () => {
		if (!ballRef.current || !canvasRef.current || !ctxRef.current) return
		const ctx = ctxRef.current
		ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
		ballRef.current.draw(ctx);
		requestRef.current = requestAnimationFrame(renderCanvas)
	}

	useEffect(() => {
		initGame()
		requestRef.current = requestAnimationFrame(renderCanvas)

		return () => {
			if (!requestRef.current) return
			cancelAnimationFrame(requestRef.current)
			window.removeEventListener('keydown', sendGameEvent)
		}
	})

	return (
		// TODO: width and height should be defined in a config file
		<canvas width={1280} height={720} ref={canvasRef}>
			Canvas
		</canvas>
	)
}