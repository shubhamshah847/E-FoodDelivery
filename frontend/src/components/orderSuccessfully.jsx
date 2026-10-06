import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrderSucess({ order, onClose }) {
    const navigate=useNavigate()
    const orders = {
        id: order.orderId,
        eta: "25 - 35 mins",
        restaurant: order.shopName,
        address: order.
            deliveryAddress,
        amount: order.totalAmount,
        itemsCount: order.shopOrder[0]?.shopOrderItem?.length
    };
    return (
        <div className="min-h-screen bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 font-sans text-slate-800 antialiased selection:bg-[#FF0000] selection:text-white">

            {/* Main Order Success Modal Card */}
            <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col items-center text-center overflow-hidden">

                {/* Top Bar: Brand Logo & Top-Right 'X' Close Button */}
                <div className="w-full flex items-center justify-between pb-2 mb-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-6.5 h-6.5 rounded-xl bg-[#FF0000] flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#FF0000]/20">
                            Y
                        </div>
                        <span className="text-lg font-black tracking-tight text-slate-900">
                            yumzo<span className="text-[#FF0000]">.</span>
                        </span>
                    </div>

                    {/* Top Right 'X' Close Button */}
                    <button
                        onClick={()=>{navigate('/home')}}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all duration-200"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                </div>

                {/* Checkmark Section with Pure Crisp Green Badge & Animated Stroke */}
                <div className="relative my-7 flex items-center justify-center">

                    {/* Animated Expanding Bloom Ring 1 */}
                    <div className="absolute w-24 h-24 rounded-full bg-[#00C853]/20 animate-ripple-1" />

                    {/* Animated Expanding Bloom Ring 2 */}
                    <div className="absolute w-20 h-20 rounded-full bg-[#00C853]/30 animate-ripple-2" />

                    {/* Elastic Pop Circle Container (Vibrant Crisp Success Green) */}
                    <div className="relative w-20 h-20 rounded-full bg-[#00C853] flex items-center justify-center shadow-lg shadow-[#00C853]/30 animate-elastic-pop">
                        <svg className="w-10 h-10 text-white" viewBox="0 0 52 52">
                            <path
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 27l9 9 16-18"
                                className="animated-tick-path"
                            />
                        </svg>
                    </div>
                </div>

                {/* Heading & Order Reference */}
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Order Placed Successfully!
                </h1>

                <p className="text-xs text-slate-400 font-medium mt-1">
                    Order ID:{orders.id} <span className="font-bold text-slate-700">{order.id}</span>
                </p>

                {/* ETA Delivery Highlight Box */}
                <div className="w-full bg-red-50/50 border border-red-100 rounded-2xl p-3.5 mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000]">
                            <Clock className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div className="text-left">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Estimated Delivery
                            </span>
                            <span className="text-sm font-black text-slate-900">
                                {orders.eta}
                            </span>
                        </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#FF0000] bg-white px-2.5 py-1 rounded-full border border-red-100 shadow-2xs">
                        On time
                    </span>
                </div>

                {/* Delivery Details Summary */}
                <div className="w-full mt-4 pt-4 border-t border-slate-100 text-left space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 font-medium">
                        <h1>{orders.restaurant} {orders.itemsCount} items</h1>
                        <span className="font-black text-slate-900">{orders.amount}</span>
                    </div>

                    <div className="flex items-start gap-2 text-slate-500 pt-1">
                        <MapPin className="w-4 h-4 text-[#FF0000] shrink-0 mt-0.5 stroke-[2]" />
                        <p className="text-[9px] leading-snug font-medium line-clamp-1">
                            {orders.address}
                        </p>
                    </div>
                </div>

                {/* Single Main Action Button (Pure Red #FF0000) */}
                <div className="w-full mt-6">
                    <button
                        onClick={() => alert(`Tracking order ${order.id}...`)}
                        className="w-full bg-[#FF0000] hover:bg-red-700 active:bg-red-800 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg shadow-[#FF0000]/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm tracking-wide"
                    >
                        <span>Track Order</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </button>
                </div>

            </div>

            { }
            <style>{`
        /* Elastic scale-in pop for checkmark circle */
        @keyframes elasticPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.18);
            opacity: 1;
          }
          80% {
            transform: scale(0.92);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Smooth SVG tick path drawing */
        @keyframes drawTickPath {
          0% {
            stroke-dashoffset: 50;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        /* Expanding Wave Ring 1 */
        @keyframes ripple1 {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.65);
            opacity: 0;
          }
        }

        /* Expanding Wave Ring 2 */
        @keyframes ripple2 {
          0% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.25);
            opacity: 0;
          }
        }

        .animate-elastic-pop {
          animation: elasticPop 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animated-tick-path {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: drawTickPath 0.45s cubic-bezier(0.65, 0, 0.45, 1) forwards 0.25s;
        }

        .animate-ripple-1 {
          animation: ripple1 0.95s ease-out forwards 0.2s;
        }

        .animate-ripple-2 {
          animation: ripple2 1.2s ease-out forwards 0.3s;
        }
      `}</style>

        </div>
    );
}
