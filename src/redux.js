import { configureStore, createSlice } from "@reduxjs/toolkit";

const generalParamsSlice = createSlice({
    name: "generalParams",
    initialState: {
        darkMode: false,
        language: 'french'
    },
    reducers: {
        updateGeneralParams: (state,action) => {
            state = {...state,...action.payload};
            return state;
        }
    }
})

export const {updateGeneralParams} = generalParamsSlice.actions;

export const store = configureStore({
    reducer: {
        generalParams: generalParamsSlice.reducer
    }
})