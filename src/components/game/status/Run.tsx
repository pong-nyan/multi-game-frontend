import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Block from "../../../objects/Block";
import Ball from "../../../objects/Ball";


export default function Run({ setGameStatus }: { setGameStatus: Dispatch<SetStateAction<number>> }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const ctxRef = useRef<CanvasRenderingContext2D | null>()
	const ballRef = useRef<Ball>()
	const blocksRef = useRef<Block[]>()
	const requestRef = useRef<number>()

	const initGame = () => {
		if (!canvasRef.current) return
		const ctx = canvasRef.current.getContext('2d')
		ctxRef.current = ctx
		ballRef.current = new Ball(canvasRef.current.width, canvasRef.current.height, 10, 5)
		blocksRef.current = [new Block(20, 60, 100, 100)]
		// width: number, height: number, x: number, y: number, color?: string
	}

	const renderCanvas = () => {
		if (!ballRef.current || !canvasRef.current || !ctxRef.current || !blocksRef.current) return
		const ctx = ctxRef.current
		ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
		ballRef.current.draw(ctx, canvasRef.current.width , canvasRef.current.height, blocksRef.current[0])
		blocksRef.current[0].draw(ctx)
		console.log("hahahaha")
		requestRef.current	= requestAnimationFrame(renderCanvas)

	}
	useEffect(() => {
		initGame()
		requestRef.current	= requestAnimationFrame(renderCanvas)

		console.log("hahahaha22")
		return () => {
			if (!requestRef.current) return
			cancelAnimationFrame(requestRef.current)
		}
	})

	return (
		<canvas ref={canvasRef}>
			Canvas
		</canvas>
	)
}