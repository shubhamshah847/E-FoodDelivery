import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        city: null,
        shopData: null,
        cart: [],
        addToCart: null
    },
    reducers: {
        setuserData: (state, action) => {
            state.userData = action.payload
        },

        setCity: (state, action) => {
            state.city = action.payload
        },
        setAddress:(state,action)=>{
            state.address=action.payload
        },
        setShopData: (state, action) => {
            state.shopData = action.payload;
        },
        setCart: (state, action) => {
            state.cart = action.payload
        },
        setAddToCart: (state, action) => {
            const item = action.payload;

            const existingItem = state.cart.find(
                (cartItem) => cartItem._id === item._id
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cart.push({
                    ...item,
                    quantity: 1,
                });
            }
        },
        increaseQuantity: (state, action) => {
            const item = state.cart.find(
                (cardItem) => cardItem._id === action.payload
            )
            if (item) {
                item.quantity += 1
            }
        },
        decreaseQuantity: (state, action) => {
            const item = state.cart.find(
                (cardItem) => cardItem._id === action.payload
            )
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1
                }
            }
        },
        removeFromCart: (state, action) => {

            state.cart = state.cart.filter(
                (cartItem) => cartItem._id !== action.payload
            );

        },



    }
})
export const { setuserData, setCity,setAddress, setShopData, setCart, setAddToCart, increaseQuantity,
    decreaseQuantity,
    removeFromCart, } = userSlice.actions
export default userSlice.reducer