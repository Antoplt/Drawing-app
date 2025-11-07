import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";

// Define data structures for different canvas item types
export interface PathData {
    points: { x: number; y: number }[];
}

export interface LineData {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
}

export interface RectangleData {
    firstPoint: { x: number; y: number };
    wh: { x: number; y: number };
}

export interface EllipseData {
    firstPoint: { x: number; y: number };
	radius: { x: number; y: number };
	rotation: number;
	angle: { startAngle: number; endAngle: number };
}

export type ItemData = PathData | LineData | RectangleData | EllipseData;

// Serializable representation of a canvas item
export interface SerializedCanvasItem {
    id: string;
    type: 'Rectangle' | 'Ellipse' | 'Line' | 'Path';
    data: ItemData;
    fillStyle: string;
    strokeStyle: string;
    lineWidth: number;
}

// State structure for the canvas slice
export type CanvasState = {
    items: SerializedCanvasItem[];
    selectedItemId: string | null;
}

const initialState: CanvasState = {
  items: [],
  selectedItemId: null,
};

export const canvasSlice = createSlice({
    name: "canvas",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<SerializedCanvasItem>) => {
            // Assign a unique ID to the new item
            const item = action.payload;
            item.id = state.items.length > 0 ? (
                Math.max(...state.items.map(i => parseInt(i.id))) + 1
            ).toString() : '0';
            state.items.push(item);
            state.selectedItemId = item.id;
        },
        moveItem: (state, action: PayloadAction<{dx: number, dy: number}>) => {
            const item = state.items.find((i) => i.id === state.selectedItemId);
            if (item) {
                if (item.type === "Rectangle") {
                    const rectData = item.data as RectangleData;
                    rectData.firstPoint.x += action.payload.dx;
                    rectData.firstPoint.y += action.payload.dy;
                } else if (item.type === "Ellipse") {
                    const ellipseData = item.data as EllipseData;
                    ellipseData.firstPoint.x += action.payload.dx;
                    ellipseData.firstPoint.y += action.payload.dy;
                } else if (item.type === "Line") {
                    const lineData = item.data as LineData;
                    lineData.startPoint.x += action.payload.dx;
                    lineData.startPoint.y += action.payload.dy;
                    lineData.endPoint.x += action.payload.dx;
                    lineData.endPoint.y += action.payload.dy;
                } else if (item.type === "Path") {
                    const pathData = item.data as PathData;
                    pathData.points = pathData.points.map(p => ({
                        x: p.x + action.payload.dx,
                        y: p.y + action.payload.dy,
                    }));
                }
            }
        },
        updateItem: (state, action: PayloadAction<{posX: number, posY: number}>) => {
            const item = state.items.find((i) => i.id === state.selectedItemId);
            if (item) {
                if (item.type === "Rectangle") {
                    const rectData = item.data as RectangleData;
                    rectData.wh.x = action.payload.posX - rectData.firstPoint.x;
                    rectData.wh.y = action.payload.posY - rectData.firstPoint.y;
                } else if (item.type === "Ellipse") {
                    const ellipseData = item.data as EllipseData;
                    ellipseData.radius.x = (action.payload.posX - ellipseData.firstPoint.x) / 2;
                    ellipseData.radius.y = (action.payload.posY - ellipseData.firstPoint.y) / 2;
                } else if (item.type === "Line") {
                    const lineData = item.data as LineData;
                    lineData.endPoint.x = action.payload.posX;
                    lineData.endPoint.y = action.payload.posY;
                } else if (item.type === "Path") {
                    const pathData = item.data as PathData;
                    pathData.points.push({ x: action.payload.posX, y: action.payload.posY });
                }
            }
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((i) => i.id !== action.payload);
            state.selectedItemId = null;
        },
        selectItem: (state, action: PayloadAction<string | null>) => {
            state.selectedItemId = action.payload;
        },
        duplicateItem: (state, action: PayloadAction<string>) => {
            const item = state.items.find((i) => i.id === action.payload);
            if (item) {
                const newItem: SerializedCanvasItem = {
                    id: state.items.length > 0 ? (
                        Math.max(...state.items.map(i => parseInt(i.id))) + 1
                    ).toString() : '0',
                    data: JSON.parse(JSON.stringify(item.data)), // Make a deep copy of the data
                    type: item.type,
                    fillStyle: item.fillStyle,
                    strokeStyle: item.strokeStyle,
                    lineWidth: item.lineWidth,
                };

                // Add 10px of offset to the duplicate
                if (newItem.type === "Rectangle") {
                    (newItem.data as RectangleData).firstPoint.x += 10;
                    (newItem.data as RectangleData).firstPoint.y += 10;
                } else if (newItem.type === "Ellipse") {
                    (newItem.data as EllipseData).firstPoint.x += 10;
                    (newItem.data as EllipseData).firstPoint.y += 10;
                } else if (newItem.type === "Line") {
                    (newItem.data as LineData).startPoint.x += 10;
                    (newItem.data as LineData).startPoint.y += 10;
                    (newItem.data as LineData).endPoint.x += 10;
                    (newItem.data as LineData).endPoint.y += 10;
                } else if (newItem.type === "Path") {
                    (newItem.data as PathData).points = (newItem.data as PathData).points.map(p => ({
                    x: p.x + 10,
                    y: p.y + 10,
                    }));
                }

                state.items.push(newItem);
                state.selectedItemId = newItem.id;
            }
        },
        setSelectedItemFillStyle: (state, action: PayloadAction<string>) => {
            const item = state.items.find((i) => i.id === state.selectedItemId);
            if (item) {
                item.fillStyle = action.payload;
            }
        },
        setSelectedItemStrokeStyle: (state, action: PayloadAction<string>) => {
            const item = state.items.find((i) => i.id === state.selectedItemId);
            if (item) {
                item.strokeStyle = action.payload;
            }
        },
        setSelectedItemLineWidth: (state, action: PayloadAction<number>) => {
            const item = state.items.find((i) => i.id === state.selectedItemId);
            if (item) {
                item.lineWidth = action.payload;
            }
        }
    }
});

export const {
    addItem,
    moveItem,
    updateItem,
    removeItem,
    selectItem,
    duplicateItem,
    setSelectedItemFillStyle,
    setSelectedItemStrokeStyle,
    setSelectedItemLineWidth
} = canvasSlice.actions;
export default canvasSlice.reducer;