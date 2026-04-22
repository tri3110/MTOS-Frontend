"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/utils/store";

export default function NotificationToaster() {
    const { notifications, remove } = useNotificationStore();

    useEffect(() => {
        if (notifications.length === 0) return;

        const timers = notifications.map((n) =>
            setTimeout(() => {
                remove(n.id);
            }, 10000) // 10s
        );

        return () => {
            timers.forEach(clearTimeout);
        };
    }, [notifications, remove]);

    return (
        <div className="fixed top-6 right-6 space-y-3 z-[100] max-w-sm w-full">
            {notifications.map((n) => (
            <div
                key={n.id}
                className={`group relative flex items-start gap-4 p-4 rounded-xl shadow-2xl border-l-4 border-b-4 transition-all duration-300 transform hover:scale-[1.02] bg-white 
                    ${n.level === "success" ? "border-green-500 text-green-800" : ""}
                    ${n.level === "error" ? "border-red-500 text-red-800" : ""}
                    ${n.level === "warning" ? "border-yellow-500 text-yellow-800" : ""}
                    ${n.level === "info" ? "border-blue-500 text-blue-800" : ""}
                `}
            >
                <div className="flex-shrink-0 mt-0.5">
                    {n.level === "success" && <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    {n.level === "error" && <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    {n.level === "warning" && <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                    {n.level === "info" && <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">
                        {n.title || n.level.toUpperCase()}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2">
                        {n.message}
                    </p>
                </div>

                <button 
                onClick={() => remove(n.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            ))}
        </div>
    );
}