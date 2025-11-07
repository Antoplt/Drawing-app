import './Canvas.css'
import type { JSX } from 'react';
import type { Mode } from '../mode/Mode.ts';

function Canvas({canvasRef, currentMode}: 
                {canvasRef: React.RefObject<HTMLCanvasElement|null>,
                currentMode: Mode | null
                }): JSX.Element {

    return (
        <div id="div-canvas">
            <canvas 
                id="canvas" 
                ref={canvasRef} 
                onMouseDown={(event: React.MouseEvent) => {currentMode?.onMouseDown(event)}}
                onMouseMove={(event: React.MouseEvent) => {currentMode?.onMouseMove(event)}}
                onMouseUp={(event: React.MouseEvent) => {currentMode?.onMouseUp(event)}}
            />
        </div>
    )
}

export default Canvas;