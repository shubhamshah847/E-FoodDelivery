import { useState } from "react";
import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { serverURI } from "../App";
import OrderStatusTimeline, { NEXT_ORDER_STATUS } from "./OrderStatusTimeline";
const GetOwnerOrder = () => {
    const [orderDetails, setOrderDetails] = useState(null)
    const [detailsLoadingId, setDetailsLoadingId] = useState(null)
    const [showOrderDetails, setShowOrderDetails] = useState(false)
    const [statusUpdating, setStatusUpdating] = useState(false)
    const [statusUpdateError, setStatusUpdateError] = useState("")
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const getMyOrders = async () => {
        try {
            const result = await axios.get(
                serverURI + "/user/owner/order/get-my-orders",
                {
                    withCredentials: true,
                }
            );
            setOrders(result.data.orders || []);
        } catch (error) {
            console.error("Could not load owner orders:", error);
        } finally {
            setLoading(false);
        }
    };
    const viewDetailsOrder = async (orderId) => {
        setDetailsLoadingId(orderId);
        setOrderDetails(null);
        setShowOrderDetails(false);
        try {
            const details = await axios.get(
                `${serverURI}/user/owner/get-order-details/${encodeURIComponent(orderId)}`,
                { withCredentials: true }
            );
            setOrderDetails(details.data.order);
            setShowOrderDetails(true);
        }
        catch (err) {
            console.error("Could not load order details:", err)
        } finally {
            setDetailsLoadingId(null);
        }
    }

    const closeOrderDetails = () => {
        setShowOrderDetails(false);
        setOrderDetails(null);
    };

    const updateOrderStatus = async (status) => {
        if (!orderDetails || statusUpdating) return;

        setStatusUpdating(true);
        setStatusUpdateError("");
        try {
            const response = await axios.patch(
                `${serverURI}/user/owner/order/${encodeURIComponent(orderDetails.orderId)}/status`,
                { status },
                { withCredentials: true }
            );

            const updatedOrder = response.data.order;
            setOrderDetails((currentOrder) => ({ ...currentOrder, ...updatedOrder }));
            setOrders((currentOrders) => currentOrders.map((order) =>
                order.orderId === updatedOrder.orderId
                    ? { ...order, status: updatedOrder.status, updatedAt: updatedOrder.updatedAt }
                    : order
            ));
        } catch (error) {
            setStatusUpdateError(
                error.response?.data?.message || "Could not update order status. Please try again."
            );
        } finally {
            setStatusUpdating(false);
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
    const OwnerOrder = ({ orderDetails }) => {
        const nextStatus = NEXT_ORDER_STATUS[orderDetails.status];
        const canCancel = ["pending", "confirmed", "preparing"].includes(orderDetails.status);

        return (
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">

                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="font-bold text-lg">
                            Order #{orderDetails.orderId}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {new Date(orderDetails.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                        {orderDetails.status}
                    </span>
                </div>

                <div className="mb-5">
                    <OrderStatusTimeline status={orderDetails.status} />
                    <div className="mt-4 flex flex-wrap gap-3">
                        {nextStatus && (
                            <button
                                type="button"
                                onClick={() => updateOrderStatus(nextStatus)}
                                disabled={statusUpdating}
                                className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {statusUpdating ? "Saving..." : `Mark ${nextStatus.replaceAll("_", " ")}`}
                            </button>
                        )}
                        {canCancel && (
                            <button
                                type="button"
                                onClick={() => updateOrderStatus("cancelled")}
                                disabled={statusUpdating}
                                className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel order
                            </button>
                        )}
                    </div>
                    {statusUpdateError && (
                        <p className="mt-2 text-sm text-red-600" role="alert">{statusUpdateError}</p>
                    )}
                </div>

                {/* Customer */}
                <div className="mb-4">
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-semibold">
                        {orderDetails.user?.name}
                    </p>
                </div>

                {/* Items */}
                <div className="border-t pt-4">

                    <h3 className="font-semibold mb-3">
                        Ordered Items
                    </h3>

                    <div className="space-y-3">

                        {orderDetails.shopOrder?.map((shopOrder, index) => (

                            <div key={index}>

                                {shopOrder.shopOrderItem?.map((item, itemIndex) => (

                                    <div
                                        key={itemIndex}
                                        className="flex justify-between items-center bg-gray-50 p-3 rounded-xl"
                                    >

                                        <div>
                                            <p className="font-medium">
                                                {item.items?.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>

                                        <p className="font-semibold">
                                            ₹{item.price * item.quantity}
                                        </p>

                                    </div>

                                ))}

                            </div>

                        ))}

                    </div>
                </div>

                {/* Total */}
                <div className="border-t mt-4 pt-4 flex justify-between">
                    <span className="font-semibold">
                        Total
                    </span>

                    <span className="font-bold text-lg">
                        ₹{orderDetails.totalAmount}
                    </span>
                </div>

            </div>
        );
    };


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

                                        <button onClick={() => viewDetailsOrder(order.orderId)}
                                            className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
                                        >
                                            {detailsLoadingId === order.orderId ? "Loading..." : "View Details"}
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>

            {showOrderDetails && orderDetails && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
                    onClick={closeOrderDetails}
                    role="presentation"
                >
                    <section
                        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="owner-order-details-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
                            <h2 id="owner-order-details-title" className="text-xl font-bold text-gray-900">
                                Order Details
                            </h2>
                            <button
                                type="button"
                                onClick={closeOrderDetails}
                                aria-label="Close order details"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
                            >
                                ×
                            </button>
                        </div>
                        <OwnerOrder orderDetails={orderDetails} />
                    </section>
                </div>
            )}
        </div>

    );
};

export default GetOwnerOrder;