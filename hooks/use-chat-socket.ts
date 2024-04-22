import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { useEffect, useState } from "react";

type ChatSocketProps = {
    profileId: string;
    addKey: string;
    updateKey: string;
    queryKey: string;
    typingKey: string;
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile;
    };
}

type NotificationData = {
    description?: string;
    image: string;
};

export const useChatSocket = ({
    profileId,
    addKey,
    updateKey,
    queryKey,
    typingKey,
}: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();
    const [isTyping, setIsTyping] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const params = useParams();
    const channelId = params?.channelId as string;
      
    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleNewMessage = (message: MessageWithMemberWithProfile, {description, image}: NotificationData) => {
            const profileMessageId = message.member.profile.id;
            const profileName = message.member.profile.name === "null null" ? "Anonymous" : message.member.profile.name;
            
            if (profileMessageId !== profileId) {
                const notification = new Notification(`${profileName} ${description ? `(${description})` : ''}`, { body: message.content, icon: image });
                if (!("Notification" in window)) {
                    console.log("This browser does not support desktop notification");
                }
                else if (Notification.permission === "granted") {
                    notification;
                }
                else if (Notification.permission !== "denied") {
                    Notification.requestPermission().then(function (permission) {
                        if (permission === "granted") {
                            notification;
                        }
                    });
                }
            }

            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{
                            items: [message],
                        }]
                    }
                }
        
                const newData = [...oldData.pages];
        
                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...newData[0].items
                    ]
                }
        
                setIsTyping(false);
        
                return {
                    ...oldData,
                    pages: newData,
                }
            });
        };
        socket.on(addKey, handleNewMessage);

        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMemberWithProfile) => {
                            if (item.id === message.id) {
                                return message;
                            }
                            return item;
                        })
                    }
                });

                return {
                    ...oldData,
                    pages: newData,
                }
            });
        });

        socket.on(typingKey, (userName: string, userId: string) => {
            setIsTyping(true);
            setUserName(userName !== "null null" ? userName : "Anonymous");
            setUserId(userId);

            setTimeout(() => {
                setIsTyping(false);
                setUserName("");
                setUserId("");
            }, 10000);
        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
            socket.off(typingKey);
        }
    }, [queryClient, profileId, addKey, queryKey, socket, updateKey, typingKey, isTyping, channelId])

    return {
        isTyping,
        userName,
        userId,
    }
}