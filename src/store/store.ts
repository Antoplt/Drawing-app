import { configureStore } from "@reduxjs/toolkit";
import toolbarReducer from "./slices/toolbarSlice";
import canvasReducer from "./slices/canvasSlice";

export const store = configureStore({
   reducer: {
      toolbar: toolbarReducer,
      canvas: canvasReducer,
   }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch