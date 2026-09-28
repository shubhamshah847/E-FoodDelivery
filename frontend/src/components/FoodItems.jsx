import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverURI } from "../App";

function FoodItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= GET ALL ITEMS =================
    const getItems = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                serverURI + "/api/get-all-items",
                {
                    withCredentials: true,
                }
            );

            const fetchedItems = response.data.items || [];

            // Randomize item order
            const randomItems = [...fetchedItems].sort(
                () => Math.random() - 0.5
            );

            setItems(randomItems);
        } catch (error) {
            console.log("Get items error:", error);
        } finally {
            setLoading(false);
        }
    };

    // ================= LOAD ITEMS =================
    useEffect(() => {
        getItems();
    }, []);

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div
                        key={item}
                        className="animate-pulse rounded-2xl border border-gray-100 bg-white p-2"
                    >
                        <div className="h-44 rounded-xl bg-gray-200"></div>

                        <div className="mt-3 h-4 w-3/4 rounded bg-gray-200"></div>

                        <div className="mt-2 h-3 w-1/2 rounded bg-gray-200"></div>

                        <div className="mt-4 h-8 w-full rounded bg-gray-200"></div>
                    </div>
                ))}
            </div>
        );
    }

    // ================= NO ITEMS =================
    if (items.length === 0) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl">
                        🍽️
                    </div>

                    <h2 className="mt-3 text-lg font-bold text-gray-800">
                        No food items available
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Food items will appear here when shops add them.
                    </p>
                </div>
            </div>
        );
    }

    // ================= MAIN UI =================
    return (
        <div className="w-full">

            {/* ================= SECTION HEADER ================= */}
            <div className="mb-5 flex items-center justify-between">

                <div>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                        Fresh & Tasty
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Delicious food delivered to your doorstep
                    </p>
                </div>

                <span className="hidden rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 sm:block">
                    {items.length} items
                </span>

            </div>


            {/* ================= FOOD GRID ================= */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5">

                {items.map((item) => {

                    // ================= DISCOUNT PRICE =================
                    const finalPrice =
                        item.discount > 0
                            ? Math.round(
                                item.price -
                                (item.price * item.discount) / 100
                            )
                            : item.price;

                    return (
                        <div
                            key={item._id}
                            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >

                            {/* ================= IMAGE ================= */}
                            <div className="relative h-40 overflow-hidden rounded-xl bg-gray-100 sm:h-44">

                                <img
                                    src={item.image}
                                    alt={item.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />

                                {/* ================= DISCOUNT BADGE ================= */}
                                {item.discount > 0 && (
                                    <div className="absolute left-2 top-2 rounded-md bg-red-600 px-2 py-1 text-[11px] font-bold text-white shadow-sm">
                                        {item.discount}% OFF
                                    </div>
                                )}

                                {/* ================= VEG / NON-VEG ================= */}
                                <div className="absolute right-2 top-2 rounded-md bg-white/95 px-2 py-1 shadow-sm backdrop-blur">

                                    <div className="flex items-center gap-1">

                                        <span
                                            className={`h-2 w-2 rounded-full ${
                                                item.foodType === "veg"
                                                    ? "bg-green-600"
                                                    : "bg-red-600"
                                            }`}
                                        ></span>

                                        <span
                                            className={`text-[9px] font-bold ${
                                                item.foodType === "veg"
                                                    ? "text-green-700"
                                                    : "text-red-700"
                                            }`}
                                        >
                                            {item.foodType === "veg"
                                                ? "VEG"
                                                : "NON-VEG"}
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* ================= DETAILS ================= */}
                            <div className="px-1 pb-1 pt-3">

                                {/* CATEGORY */}
                                <p className="mb-1 text-[11px] font-medium text-gray-400">
                                    {item.category}
                                </p>


                                {/* FOOD NAME */}
                                <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                                    {item.name}
                                </h3>


                                {/* ================= PRICE ================= */}
                                <div className="mt-2 flex items-center gap-2">

                                    {/* FINAL PRICE */}
                                    <span className="text-base font-bold text-gray-900 sm:text-lg">
                                        ₹{finalPrice}
                                    </span>

                                    {/* ORIGINAL PRICE */}
                                    {item.discount > 0 && (
                                        <span className="text-[11px] font-medium text-gray-400 line-through">
                                            ₹{item.price}
                                        </span>
                                    )}

                                </div>


                                {/* TAX */}
                                <p className="mt-0.5 text-[9px] text-gray-400">
                                    Inclusive of all taxes
                                </p>


                                {/* ================= ADD BUTTON ================= */}
                                <div className="mt-3 flex justify-end">

                                    <button
                                        type="button"
                                        className="shrink-0 rounded-lg border border-green-600 bg-white px-4 py-1.5 text-xs font-bold text-green-600 shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-300/50 active:scale-90 active:duration-100 sm:px-5 sm:py-2"
                                    >
                                        ADD
                                    </button>

                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}
export default FoodItems;

