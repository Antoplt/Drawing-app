import type { Mode } from './Mode.ts';
import type { PersistentElements } from '../PersistentElement.ts';
import { LineItem } from '../canvas/LineItem.ts';
import type { AppDispatch } from "../stores/store";
import { type SerializedCanvasItem, type LineData, addItem, updateItem } from '../slices/canvasSlice.ts';

export class LineMode implements Mode {
    
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
            const lineData: LineData = {
                startPoint: pos,
                endPoint: pos
            };

            const serializedLineItem: SerializedCanvasItem = {
                id: "", 
                type: 'Line',
                data: lineData,
                fillStyle: this.persistentElements.fillStyle,
                strokeStyle: this.persistentElements.strokeStyle,
                lineWidth: this.persistentElements.lineWidth,
            };
            this.dispatch(addItem(serializedLineItem));

            const lineItem = new LineItem(
                this.persistentElements.ctx,
                {x: pos.x, y: pos.y},
                this.persistentElements.strokeStyle,
                this.persistentElements.lineWidth,
                ""
            );
            this.persistentElements.addItem(lineItem);

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