"use client";

import { useNotificationStore } from "@/utils/store";

export default function NotificationBell() {
    const notifications = useNotificationStore((s) => s.notifications);

    return (
        <div className="relative cursor-pointer">
            🔔
            {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                    {notifications.length}
                </span>
            )}
        </div>
    );
}