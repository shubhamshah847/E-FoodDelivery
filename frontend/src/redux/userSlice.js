import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        city: null,
        shopData: null,
    },
    reducers: {
        setuserData: (state, action) => {
            state.userData = action.payload
        },

        setCity: (state, action) => {
            state.city = action.payload
        },
        setShopData: (state, action) => {
            state.shopData = action.payload;
        },
    }
})
export const { setuserData, setCity,setShopData } = userSlice.actions
export default userSlice.reducer