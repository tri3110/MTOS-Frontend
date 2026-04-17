"use client";

import { ClockIcon , ArrowUpIcon, ClipboardDocumentListIcon, BanknotesIcon, TruckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import MiniLineChart from "./MiniLine";
import { formatNumber } from "@/utils/common";

type Props = {
    data: any;
};

export const EcommerceMetrics = ({ data }: Props) => {
    const revenue = data?.revenue;
    const orders = data?.orders;
    const pending = data?.pending;
    const delivering = data?.delivering;
    const cancelled = data?.cancelled;

    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 md:gap-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] md:p-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                        <BanknotesIcon className="w-5 h-5 text-blue-600" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Total Revenue</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {formatNumber(revenue.total)} đ
                    </h3>
                </div>

                <div className="mt-4">
                    <MiniLineChart data={revenue.series} color="#3b82f6" />
                </div>

                <div className="flex items-center gap-2 mt-4 text-sm justify-end">
                    <div
                        className={`flex items-center font-medium ${revenue.percent >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                        <ArrowUpIcon
                        className={`w-4 h-4 mr-1 ${!(revenue.percent >= 0) ? "rotate-180" : ""}`}
                        />
                        {revenue.percent}%
                    </div>
                    <span className="text-gray-500">avg last 7 days</span>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] md:p-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                        <ClipboardDocumentListIcon className="w-5 h-5 text-green-600" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Total Orders</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {orders.total}
                    </h3>
                </div>

                <div className="mt-4">
                    <MiniLineChart data={orders.series} color="#22c55e" />
                </div>

                <div className="flex items-center gap-2 mt-4 text-sm justify-end">
                    <div
                        className={`flex items-center font-medium ${orders.percent >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                        <ArrowUpIcon
                        className={`w-4 h-4 mr-1 ${!(orders.percent >= 0) ? "rotate-180" : ""}`}
                        />
                        {orders.percent}%
                    </div>
                    <span className="text-gray-500">avg last 7 days</span>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] md:p-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                        <ClockIcon className="w-5 h-5 text-yellow-600" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Pending Orders</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {pending.total}
                    </h3>
                </div>

                <div className="mt-4">
                    <MiniLineChart data={pending.series} color="#eac50d" />
                </div>

                <div className="flex items-center gap-2 mt-4 text-sm justify-end">
                    <div
                        className={`flex items-center font-medium ${pending.percent >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                        <ArrowUpIcon
                        className={`w-4 h-4 mr-1 ${!(pending.percent >= 0) ? "rotate-180" : ""}`}
                        />
                        {pending.percent}%
                    </div>
                    <span className="text-gray-500">avg last 7 days</span>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] md:p-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                        <TruckIcon className="w-5 h-5 text-purple-600" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Delivering Orders</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {delivering.total}
                    </h3>
                </div>

                <div className="mt-4">
                    <MiniLineChart data={delivering.series} color="#f519f5" />
                </div>

                <div className="flex items-center gap-2 mt-4 text-sm justify-end">
                    <div
                        className={`flex items-center font-medium ${delivering.percent >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                        <ArrowUpIcon
                        className={`w-4 h-4 mr-1 ${!(delivering.percent >= 0) ? "rotate-180" : ""}`}
                        />
                        {delivering.percent}%
                    </div>
                    <span className="text-gray-500">avg last 7 days</span>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] md:p-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                        <XCircleIcon className="w-5 h-5 text-red-600" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Cancelled Orders</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {cancelled.total}
                    </h3>
                </div>

                <div className="mt-4">
                    <MiniLineChart data={cancelled.series} color="#f03564" />
                </div>

                <div className="flex items-center gap-2 mt-4 text-sm justify-end">
                    <div
                        className={`flex items-center font-medium ${cancelled.percent >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                        <ArrowUpIcon
                        className={`w-4 h-4 mr-1 ${!(cancelled.percent >= 0) ? "rotate-180" : ""}`}
                        />
                        {cancelled.percent}%
                    </div>
                    <span className="text-gray-500">avg last 7 days</span>
                </div>
            </div>
        </div>
    );
};