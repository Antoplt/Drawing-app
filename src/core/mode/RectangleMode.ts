import type { Mode } from './Mode.ts';
import type { PersistentElements } from '../PersistentElements.ts';
import { RectangleItem } from '../shapes/RectangleItem.ts';
import type { AppDispatch } from "../../store/store";
import { type SerializedCanvasItem, type RectangleData, addItem, updateItem } from '../../store/slices/canvasSlice.ts';

export class RectangleMode implements Mode {

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
            const rectData: RectangleData = {
                firstPoint: pos,
                wh: { x: 0, y: 0 }
            };
            
            const serializedRectItem: SerializedCanvasItem = {
                id: "", // ID will be assigned in the reducer
                type: 'Rectangle',
                data: rectData,
                fillStyle: this.persistentElements.fillStyle,
                strokeStyle: this.persistentElements.strokeStyle,
                lineWidth: this.persistentElements.lineWidth,
            };
            this.dispatch(addItem(serializedRectItem)); // Add item to the Redux store

            const rectItem = new RectangleItem(
                this.persistentElements.ctx,
                {x: pos.x, y: pos.y},
                this.persistentElements.fillStyle,
                this.persistentElements.strokeStyle,
                this.persistentElements.lineWidth,
                "" // ID will be assigned by the addItem method in PersistentElements
            );
            this.persistentElements.addItem(rectItem); // Add item to PersistentElements

            this.drawing = true;
        }
    }

    onMouseMove(event: React.MouseEvent): void {
        if (this.persistentElements && this.drawing) {
            const point = this.persistentElements.getMousePos(event.clientX, event.clientY);
            this.dispatch(updateItem({posX: point.x, posY: point.y})); // Update item in the Redux store
            this.persistentElements.selectedItem?.update(point.x, point.y); // Update item in PersistentElements
            this.persistentElements.redraw();
        }
    }

    onMouseUp(): void {
        this.drawing = false;
    }

}