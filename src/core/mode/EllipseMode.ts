import type { Mode } from './Mode.ts';
import type { PersistentElements } from '../PersistentElements.ts';
import { EllipseItem } from '../shapes/EllipseItem.ts';
import type { AppDispatch } from "../../store/store";
import { type SerializedCanvasItem, type EllipseData, addItem, updateItem } from '../../store/slices/canvasSlice.ts';

export class EllipseMode implements Mode {
    
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
            const ellipseData: EllipseData = {
                firstPoint: pos,
                radius: { x: 0, y: 0 },
                rotation: 0,
                angle: { startAngle: 0, endAngle: 2 * Math.PI }
            };

            const serializedEllipseItem: SerializedCanvasItem = {
                id: "",
                type: 'Ellipse',
                data: ellipseData,
                fillStyle: this.persistentElements.fillStyle,
                strokeStyle: this.persistentElements.strokeStyle,
                lineWidth: this.persistentElements.lineWidth,
            };
            this.dispatch(addItem(serializedEllipseItem));

            const ellipseItem = new EllipseItem(
                this.persistentElements.ctx,
                {x: pos.x, y: pos.y},
                this.persistentElements.fillStyle,
                this.persistentElements.strokeStyle,
                this.persistentElements.lineWidth,
                ""
            );
            this.persistentElements.addItem(ellipseItem);

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