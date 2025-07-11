import { useEffect, useRef } from "react";
import { NotificationMessage } from "../utils/types";

export const useWebSocket = (
  userId: number,
  onMessage: (msg: NotificationMessage) => void
) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/ws/notifications/${userId}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data: NotificationMessage = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [userId, onMessage]);
};
