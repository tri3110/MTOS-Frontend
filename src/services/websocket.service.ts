import { useNotificationStore } from "@/utils/store";

let socket: WebSocket | null = null;

export function initWebSocket(userId: number) {
    if (socket) return socket;

    socket = new WebSocket(`ws://127.0.0.1:8000/ws/user/${userId}/`);

    const addNotification = useNotificationStore.getState().add;

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "notification") {
            addNotification(data.payload);
        }
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected");
    };

    return socket;
}