import type { RootState } from "./stores/store";
import type { CanvasItem } from "./canvas/CanvasItem";

export class PersistentElements {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public fillStyle: string;
    public strokeStyle: string;
    public lineWidth: number;
    public items: CanvasItem[];
    public selectedItem: CanvasItem | null = null;
    public getState: () => RootState;

    constructor(canvas:HTMLCanvasElement, 
                ctx: CanvasRenderingContext2D,
                fillStyle: string,
                strokeStyle: string,
                lineWidth: number,
                getState: () => RootState) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.items = [];
        this.getState = getState;
    }

    // add item to the canvas
    addItem(item: CanvasItem, id?: string) {
        // assign ID from the selected item in the Redux store to the item to be added
        // so as to link the two representations of the item
        let itemId: string | null;
        if (id) {
            itemId = id;
        } else {
            const state = this.getState();
            itemId = state.canvas.selectedItemId;
        }
        if (itemId) {
            item.id = itemId;
        }
        this.items.push(item);
        this.selectedItem = item;
    }

    // remove selected item from the canvas
    removeSelectedItem() {
        if (this.selectedItem) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].id === this.selectedItem.id) {
                    this.items.splice(i, 1);
                    break;
                }
            }
            this.selectedItem = null;
            this.redraw();
        }
    }

    // duplicate selected item
    duplicateSelectedItem() {
        // Precondition : redux stored item must have been duplicated first to get a new ID
        const state = this.getState();
        const id = state.canvas.selectedItemId; // new ID from Redux store
        if (id) {
            const newItem = this.selectedItem?.duplicate(id);
            if (newItem) {
                this.addItem(newItem, id);
                this.redraw();
            }
        }
        
    }

    // get items under the given coordinates
    getItemAt(x: number, y: number): CanvasItem | null {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].contains(x, y)) {
                return this.items[i];
            }
        }
        return null;
    }

    // get mouse position relative to the canvas
    getMousePos(x: number, y: number) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: x - rect.left,
            y: y - rect.top
        };
    }

    // redraw all items
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.items.forEach(item => item.draw());
    }

    setFillStyle(fillStyle: string) {
        this.fillStyle = fillStyle;
    }

    setStrokeStyle(strokeStyle: string) {
        this.strokeStyle = strokeStyle;
    }

    setLineWidth(width: number) {
        this.lineWidth = width;
    }

    setSelectedItemFillStyle(fillStyle: string) {
        if (this.selectedItem) {
            this.selectedItem.fillStyle = fillStyle;
            this.redraw();
        }
    }

    setSelectedItemStrokeStyle(strokeStyle: string) {
        if (this.selectedItem) {
            this.selectedItem.strokeStyle = strokeStyle;
            this.redraw();
        }
    }

    setSelectedItemLineWidth(lineWidth: number) {
        if (this.selectedItem) {
            this.selectedItem.lineWidth = lineWidth;
            this.redraw();
        }
    }

}