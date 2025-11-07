import type { Mode } from './Mode.ts';
import type { PersistentElements } from '../PersistentElements.ts';
import { PathItem } from '../shapes/PathItem.ts';
import type { AppDispatch } from "../../store/store";
import { type SerializedCanvasItem, type PathData, addItem, updateItem } from '../../store/slices/canvasSlice.ts';

export class PathMode implements Mode {
    
    private persistentElements: PersistentElements | null = null;
    private dispatch: AppDispatch;
    private drawing: boolean = false;

    constructor(persistentElements: PersistentElements | null, dispatch: AppDispatch) {
        this.persistentElements = persistentElements;
        this.dispatch = dispatch;
    }

    onMouseDown(event: React.MouseEvent): void {
        if (this.persistentElements) {
            const pos = this.persistentElements.getMousePos(event.clientX, event.clientY);
            const pathData: PathData = {
                points: [pos]
            };
            
            const serializedPathItem: SerializedCanvasItem = {
                id: "", 
                type: 'Path',
                data: pathData,
                fillStyle: this.persistentElements.fillStyle,
                strokeStyle: this.persistentElements.strokeStyle,
                lineWidth: this.persistentElements.lineWidth,
            };
            this.dispatch(addItem(serializedPathItem));

            const pathItem = new PathItem(
                this.persistentElements.ctx,
                {x: pos.x, y: pos.y},
                this.persistentElements.strokeStyle,
                this.persistentElements.lineWidth,
                ""
            );
            this.persistentElements.addItem(pathItem);

            this.drawing = true;
        }
    }

    onMouseMove(event: React.MouseEvent): void {
        if (this.persistentElements && this.drawing) {
            const point = this.persistentElements.getMousePos(event.clientX, event.clientY);
            this.dispatch(updateItem({posX: point.x, posY: point.y}));
            this.persistentElements.selectedItem?.update(point.x, point.y);
            this.persistentElements.redraw();
        }
    }

    onMouseUp(): void {
        this.drawing = false;
    }

}