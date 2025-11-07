import './App.css';
import Canvas from './Canvas.tsx';
import Toolbar from './Toolbar.tsx';
import { useEffect, useRef, useState, type JSX } from 'react';
import { PersistentElements } from '../core/PersistentElements.ts';
import { useAppSelector } from "../hooks/storeHooks";
import { store, type RootState } from '../store/store';
import { useMode } from '../hooks/useMode.ts';

function App(): JSX.Element  {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const [persistentElements, setPersistentElements] = useState<PersistentElements | null>(null);

	const { currentMode, setMode } = useMode(persistentElements);
	const currentModeName = useAppSelector((state: RootState) => state.toolbar.currentModeName);

	const fillStyle = useAppSelector((state: RootState) => state.toolbar.fillStyle);
	const strokeStyle = useAppSelector((state: RootState) => state.toolbar.strokeStyle);
	const lineWidth = useAppSelector((state: RootState) => state.toolbar.lineWidth);

	// Initialize PersistentElements only once
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				console.error("2D context not available");
				return;
			}

			const tempPersistentElements = new PersistentElements(
				canvas, 
				ctx,
				fillStyle,
				strokeStyle,
				lineWidth,
				() => store.getState()
			);
			setPersistentElements(tempPersistentElements);

			resizeCanvas(canvas);
			window.addEventListener('resize', () => {
				resizeCanvas(canvas);
				tempPersistentElements.redraw();
			});
		} else {
			console.error("Canvas not found");
		}
	}, []);

	// Update colors on PersistentElements when they change
	useEffect(() => {
		if (persistentElements) {
			persistentElements.setFillStyle(fillStyle);
			persistentElements.setStrokeStyle(strokeStyle);
			persistentElements.setLineWidth(lineWidth);
		}
	}, [persistentElements, fillStyle, strokeStyle, lineWidth]);

	// Resize the canvas to fill its parent element
	function resizeCanvas(canvas: HTMLCanvasElement) {
		const { width, height } = canvas.getBoundingClientRect();
		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width;
			canvas.height = height;
		}
	}

	return (
		<>
			<div id="main-div">
				<Toolbar persistentElements={persistentElements} currentModeName={currentModeName} setMode={setMode}/>
				<Canvas canvasRef={canvasRef} currentMode={currentMode}/>
			</div>
		</>
	)
}

export default App
