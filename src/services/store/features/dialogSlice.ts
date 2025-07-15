// store/features/dialogSlice.ts
import {createSlice} from "@reduxjs/toolkit";

interface DialogState {
    forceCloseAll: boolean;
}

const initialState: DialogState = {
    forceCloseAll: false,
};

const dialogSlice = createSlice({
    name: "dialog",
    initialState,
    reducers: {
        triggerCloseAll: (state) => {
            state.forceCloseAll = true;
        },
        resetCloseAll: (state) => {
            state.forceCloseAll = false;
        },
    },
});

export const {triggerCloseAll, resetCloseAll} = dialogSlice.actions;
export default dialogSlice.reducer;
