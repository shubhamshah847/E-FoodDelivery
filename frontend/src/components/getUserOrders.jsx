import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverURI } from "../App";
import { useSelector } from "react-redux";

const GetMyOrders = () => {
    const { userData } = useSelector((state) => state.user);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const getMyOrders = async () => {
        try {
            const result = await axios.get(
                `${serverURI}/user/order/get-my-orders`,
                {
                    withCredentials: true,
                }
            );

            setOrders(result.data.order);
            console.log("userOrders", result.data)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Orders
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Track and manage your food orders
                    </p>
                </div>

                {/* No Orders */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                        <div className="text-5xl mb-4">🍔</div>

                        <h2 className="text-xl font-semibold text-gray-800">
                            No orders yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Your delicious orders will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {orders.map((order) => (
                            <div
                                key={order?.orderId || "Id not exist"}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                            >

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            ORDER ID
                                        </p>

                                        <p className="font-semibold text-gray-800">
                                            #{order.orderId}
                                        </p>
                                    </div>

                                    <span
                                        className={`w-fit px-3 py-1 rounded-full text-sm font-medium
        ${order.status === "delivered"
                                                ? "bg-green-100 text-green-700"
                                                : order.status === "cancelled"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {order.status}
                                    </span>

                                </div>

                                <div className="p-5">

                                    {order.shopOrder?.map((shopOrder, index) => (
                                        <div key={index} className="mb-5">

                                            <div className="flex items-center gap-3 mb-3">

                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                    🏪
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-gray-800">
                                                        {shopOrder.shop?.name || "Restaurant"}
                                                    </h3>

                                                    <p className="text-sm text-gray-500">
                                                        {shopOrder?.shopOrderItem.length || "not fetched "} items
                                                    </p>
                                                </div>

                                            </div>

                                        </div>
                                    ))}

                                    <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                ORDER DATE
                                            </p>

                                            <p className="text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                TOTAL
                                            </p>

                                            <p className="text-xl font-bold text-gray-900">
                                                ₹{order.totalAmount}
                                            </p>
                                        </div>

                                        <button
                                            className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
                                        >
                                            View Details
                                        </button>

                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>

    );
};

export default GetMyOrders;