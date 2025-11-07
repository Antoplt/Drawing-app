import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ModeName } from "../mode/modeTypes";

interface toolbarState {
    currentModeName: ModeName;
    fillStyle: string;
	strokeStyle: string;
	lineWidth: number;
}

const initialState: toolbarState = {
    currentModeName: "SelectMove",
    fillStyle: "#0d00ff",
    strokeStyle: "#000000",
    lineWidth: 2,
}

const toolbarSlice = createSlice({
    name: 'toolbar',
    initialState: initialState,
    reducers: {
        setCurrentModeName: (state, action: PayloadAction<ModeName>) => {
            state.currentModeName = action.payload;
        },
        setFillStyle: (state, action: PayloadAction<string>) => {
            state.fillStyle = action.payload;
        },
        setStrokeStyle: (state, action: PayloadAction<string>) => {
            state.strokeStyle = action.payload;
        },
        setLineWidth: (state, action: PayloadAction<number>) => {
            state.lineWidth = action.payload;
        },
    }
})

export const { 
    setCurrentModeName, 
    setFillStyle, 
    setStrokeStyle, 
    setLineWidth 
} = toolbarSlice.actions
export default toolbarSlice.reducer