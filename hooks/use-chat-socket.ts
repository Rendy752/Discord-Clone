import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";

import { useEffect, useState } from "react";

type ChatSocketProps = {
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

export const useChatSocket = ({
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
      
    useEffect(() => {
        if (!socket) {
            return;
        }

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

        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
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
    }, [queryClient, addKey, queryKey, socket, updateKey, typingKey, isTyping])

    return {
        isTyping,
        userName,
        userId,
    }
}