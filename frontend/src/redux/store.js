import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import mapSlice from "./mapSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        map:mapSlice
    }
}); 