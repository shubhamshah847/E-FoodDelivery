import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverURI } from "../App";
import { useSelector } from "react-redux";
import OrderStatusTimeline from "./OrderStatusTimeline";

const GetMyOrders = () => {
    const { userData } = useSelector((state) => state.user);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const getMyOrders = async () => {
        try {
            const result = await axios.get(
                `${serverURI}/user/order/get-my-orders`,
                {
                    withCredentials: true,
                }
            );

            const fetchedOrders = result.data.order || [];
            setOrders(fetchedOrders);
            setSelectedOrder((currentOrder) => currentOrder
                ? fetchedOrders.find((order) => order.orderId === currentOrder.orderId) || currentOrder
                : null);
        } catch (error) {
            console.error("Could not load user orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyOrders();
        const refreshInterval = window.setInterval(getMyOrders, 10000);
        return () => window.clearInterval(refreshInterval);
    }, []);

    const UserOrderDetails = ({ order }) => (
        <div className="space-y-5">
            <OrderStatusTimeline status={order.status} />

            <div className="rounded-xl border border-slate-100 p-4">
                <h3 className="mb-3 font-semibold text-slate-800">Items</h3>
                <div className="space-y-3">
                    {order.shopOrder?.flatMap((shopOrder) => shopOrder.shopOrderItem || []).map((item, index) => (
                        <div key={item._id || index} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3">
                            <div>
                                <p className="font-medium text-slate-800">{item.items?.name || "Food item"}</p>
                                <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-slate-800">₹{item.subTotal ?? item.price * item.quantity}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                <div>
                    <p className="text-slate-500">Delivery address</p>
                    <p className="font-medium text-slate-800">{order.deliveryAddress}</p>
                </div>
                <div>
                    <p className="text-slate-500">Payment</p>
                    <p className="font-medium capitalize text-slate-800">{order.paymentMethod}</p>
                </div>
            </div>
        </div>
    );

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
                                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                            >
                                <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400">ORDER ID</p>
                                        <p className="font-semibold text-gray-800">#{order.orderId}</p>
                                    </div>
                                    <span className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
                                        order.status === "delivered"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "cancelled"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="p-5">
                                    <div className="mb-5 space-y-3">
                                        {order.shopOrder?.map((shopOrder, index) => (
                                            <div key={shopOrder._id || index} className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">🏪</div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{shopOrder.shop?.name || "Restaurant"}</h3>
                                                    <p className="text-sm text-gray-500">{shopOrder.shopOrderItem?.length || 0} items</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-5">
                                        <OrderStatusTimeline status={order.status} />
                                    </div>

                                    <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400">ORDER DATE</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">TOTAL</p>
                                            <p className="text-xl font-bold text-gray-900">₹{order.totalAmount}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedOrder(order)}
                                            className="rounded-xl bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:bg-orange-600"
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

            {selectedOrder && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedOrder(null)}
                    role="presentation"
                >
                    <section
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="customer-order-details-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h2 id="customer-order-details-title" className="text-xl font-bold text-slate-900">Order Details</h2>
                                <p className="mt-1 text-sm text-slate-500">#{selectedOrder.orderId}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                aria-label="Close order details"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200"
                            >
                                ×
                            </button>
                        </div>
                        <UserOrderDetails order={selectedOrder} />
                    </section>
                </div>
            )}
        </div>

    );
};

export default GetMyOrders;