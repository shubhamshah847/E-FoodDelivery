import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { decreaseQuantity, increaseQuantity, removeFromCart } from "../redux/userSlice";
import { IoIosAddCircle } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
function Cart() {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const cart = useSelector((state) => state.user.cart);

    const totalAmount = cart.reduce(
        (total, item) =>
            total + Number(item.price) * (item.quantity || 1),
        0
    );
    const discount = totalAmount>1000 ? 50 : 10

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-10">

            {/* Back Button */}
            <button
                onClick={() => navigate("/home")}
                className="mb-6 flex items-center gap-2 text-gray-600 transition hover:text-orange-500"
            >
                <span className="text-2xl"><IoMdArrowRoundBack className="text-red-500" /></span>
                <span className="font-medium">Back</span>
            </button>


            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Your Cart
                </h1>

                <p className="mt-1 text-gray-500">
                    {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
                </p>
            </div>


            {/* Empty Cart */}
            {cart.length === 0 ? (

                <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">

                    <div className="mb-5 text-7xl">
                        🛒
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800">
                        Your cart is empty
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Add some delicious food to your cart.
                    </p>

                    <button
                        onClick={() => navigate("/home")}
                        className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                    >
                        Explore Food
                    </button>

                </div>

            ) : (

                <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">

                    {/* Cart Items */}
                    <div className="space-y-4 lg:col-span-2">

                        {cart.map((item) => (

                            <div
                                key={item._id}
                                className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"
                            >

                                {/* Food Image */}
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-28 w-28 rounded-xl object-cover"
                                />


                                {/* Food Details */}
                                <div className="flex flex-1 flex-col justify-between">

                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            {item.name}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            ₹{item.price}
                                        </p>
                                    </div>


                                    <div className="mt-3 flex items-center justify-between">

                                        {/* Quantity */}
                                        <div className="flex items-center gap-3">

                                            <button onClick={() => dispatch(decreaseQuantity(item._id))}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-lg hover:bg-gray-200"
                                            >
                                                -
                                            </button>

                                            <span className="font-semibold">
                                                {item.quantity || 1}
                                            </span>

                                            <button onClick={() =>
                                                dispatch(increaseQuantity(item._id))
                                            }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                                            >

                                                +

                                            </button>

                                        </div>


                                        {/* Remove */}
                                        <button onClick={() =>
                                            dispatch(removeFromCart(item._id))
                                        }
                                            className="text-sm font-medium text-red-500 hover:text-red-600"
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>


                    {/* Order Summary */}
                    <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">

                        <h2 className="mb-6 text-xl font-bold text-gray-800">
                            Order Summary
                        </h2>


                        {/* Subtotal */}
                        <div className="space-y-4">

                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{totalAmount}</span>
                            </div>


                            {/* Delivery Fee */}
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span>{discount}</span>
                            </div>


                            {/* Total */}
                            <div className="border-t pt-4">

                                <div className="flex justify-between text-lg font-bold text-gray-800">
                                    <span>Total</span>

                                    <span>
                                        ₹{totalAmount + discount}
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* Checkout */}
                        <button onClick={() => { navigate('/item/checkout') }}
                            className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
                        >
                            Proceed to Checkout
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Cart;
