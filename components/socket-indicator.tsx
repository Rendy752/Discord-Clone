"use client";

import { cn } from "@/lib/utils";
import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => {
    const { isConnected } = useSocket();

    return (
        <Badge variant="outline" className={cn(isConnected ? "bg-emerald-600" : "bg-yellow-600", "text-white border-none")}>
            {isConnected ? "Live: Real-time updates" : "Fallback: Polling every 1s"}
        </Badge>
    );
}