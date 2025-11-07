import type { Mode } from './Mode.ts';
import type { PersistentElements } from '../PersistentElement.ts';
import type { AppDispatch } from "../stores/store";
import { selectItem, moveItem } from '../slices/canvasSlice.ts';

export class SelectMoveMode implements Mode {
    
    private persistentElements: PersistentElements | null = null;
    private dispatch: AppDispatch;
    private isDragging: boolean = false;
    private initialMousePos: { x: number; y: number } | null = null;

    constructor(persistentElements: PersistentElements | null, dispatch: AppDispatch) {
        this.persistentElements = persistentElements;
        this.dispatch = dispatch;
    }

    onMouseDown(event: React.MouseEvent): void {
        if (this.persistentElements) {
            this.initialMousePos = this.persistentElements.getMousePos(event.clientX, event.clientY);
            this.persistentElements.selectedItem = this.persistentElements.getItemAt(
                this.initialMousePos.x,
                this.initialMousePos.y
            );
            this.dispatch(selectItem(
                this.persistentElements.selectedItem ? this.persistentElements.selectedItem.id : null
            ));
            if (this.persistentElements.selectedItem) {
                this.isDragging = true;
            }
        }
    }

    onMouseMove(event: React.MouseEvent): void {
        if (!this.persistentElements || !this.persistentElements.selectedItem
            || !this.isDragging || !this.initialMousePos) return;
        // calculate the movement delta
        const x = this.persistentElements.getMousePos(event.clientX, event.clientY).x;
        const y = this.persistentElements.getMousePos(event.clientX, event.clientY).y;
        const dx = x - this.initialMousePos.x;
        const dy = y - this.initialMousePos.y;

        this.persistentElements.selectedItem.move(dx, dy); // move the item visually
        this.dispatch(moveItem({dx: dx, dy: dy})); // update the item position in the Redux store
        
        this.initialMousePos = { x: x, y: y };
        this.persistentElements.redraw();
    }

    onMouseUp(): void {
        this.isDragging = false;
        this.initialMousePos = null;
    }

}