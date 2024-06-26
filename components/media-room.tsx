"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
};

export const MediaRoom = ({
    chatId,
    video,
    audio,
}: MediaRoomProps) => {
    const { user } = useUser();
    const [token, setToken] = useState("");
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        if (!user?.firstName || !user?.lastName) return;
    
        const name = user.username || `${user.firstName} ${user.lastName}`;
        const uniqueId = uuidv4().split("-")[0];
        const uniqueName = `${name} - ${uniqueId}`;
    
        (async () => {
            try {
                const response = await fetch(`/api/livekit?room=${chatId}&username=${uniqueName}`);
                const data = await response.json();
                setToken(data.token);
            } catch (error) {
                console.error(error);
            }
        })()
    }, [user?.firstName, user?.lastName, chatId, user?.username]);

    if (token === "") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 
                    className="h-7 w-7 text-zinc-500 animate-spin my-4"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            className="rounded-lg p-4"
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
            onDisconnected={() => router.push(`/servers/${params?.serverId}`)}
        >
            <VideoConference />
        </LiveKitRoom>
    );
}