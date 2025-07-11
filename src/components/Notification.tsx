import React, { useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { NotificationMessage } from "../utils/types";

interface Props {
    userId: number;
}

const Notification: React.FC<Props> = ({ userId }) => {
    const [messages, setMessages] = useState<NotificationMessage[]>([]);

    useWebSocket(userId, (msg) => {
        setMessages((prev) => [msg, ...prev]);
    });

    return (
        <div>
            <h2>Thông báo:</h2>
            <ul>
                {messages.map((msg, idx) => (
                    <li key={idx}>
                        <strong>{msg.sender}</strong>: {msg.message} <em>({msg.timestamp})</em>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notification;
