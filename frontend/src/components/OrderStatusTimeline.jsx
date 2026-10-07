const ORDER_STAGES = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "out_for_delivery", label: "Out for delivery" },
    { value: "delivered", label: "Delivered" },
];

export const NEXT_ORDER_STATUS = {
    pending: "confirmed",
    confirmed: "preparing",
    preparing: "out_for_delivery",
    out_for_delivery: "delivered",
};

export const ORDER_STATUS_LABELS = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

export default function OrderStatusTimeline({ status = "pending" }) {
    const normalizedStatus = String(status || "pending")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
    const currentIndex = ORDER_STAGES.findIndex((stage) => stage.value === normalizedStatus);
    const progress = currentIndex > 0
        ? (currentIndex / (ORDER_STAGES.length - 1)) * 100
        : 0;

    return (
        <section
            className="rounded-xl border border-slate-100 bg-white p-4"
            aria-label={`Order status: ${ORDER_STATUS_LABELS[normalizedStatus] || normalizedStatus}`}
        >
            <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-800">Order progress</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    normalizedStatus === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : normalizedStatus === "delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                }`}>
                    {ORDER_STATUS_LABELS[normalizedStatus] || normalizedStatus}
                </span>
            </div>

            {normalizedStatus === "cancelled" ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    This order was cancelled.
                </div>
            ) : (
                <div className="relative flex items-start justify-between" aria-label="Order status timeline">
                    <div className="absolute left-[9%] right-[9%] top-4 h-1 rounded-full bg-slate-200">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-[width] duration-700 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {ORDER_STAGES.map((stage, index) => {
                        const isComplete = currentIndex >= 0 && index < currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                            <div key={stage.value} className="relative z-10 flex w-1/5 flex-col items-center text-center">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-500 ${
                                    isComplete
                                        ? "border-emerald-500 bg-emerald-500 text-white"
                                        : isCurrent
                                            ? "border-orange-500 bg-orange-500 text-white ring-4 ring-orange-100 shadow-md shadow-orange-200"
                                            : "border-slate-300 bg-white text-slate-400"
                                }`}>
                                    {isComplete ? "✓" : index + 1}
                                </div>
                                <span className={`mt-2 text-[10px] leading-tight sm:text-xs ${
                                    isCurrent || isComplete ? "font-semibold text-slate-800" : "text-slate-400"
                                }`}>
                                    {stage.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
