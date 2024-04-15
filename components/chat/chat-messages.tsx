"use client";

import { Fragment, useRef, ElementRef, useState } from "react";
import { format } from "date-fns";
import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { Loader2, ServerCrash } from "lucide-react";
import BeatLoader from "react-spinners/BeatLoader";
import { motion } from "framer-motion";
import { ChatItem } from "./chat-item";

import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

const DATE_FORMAT = "d MMM yyyy, h:mm a";
const SEPARATOR_DATE_FORMAT = 'MMM d, yyyy';
type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile;
    };
};

interface ChatMessagesProps {
    name: string;
    member: Member;
    profileId: string;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

export const ChatMessages = ({
    name,
    member,
    profileId,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;
    const typingKey = `chat:${chatId}:typing`;

    const topRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    })

    const { isTyping, userName, userId } = useChatSocket({ queryKey, addKey, updateKey, typingKey});
    useChatScroll({
        topRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0
    })

    if (status === "pending") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading messages...
                </p>  
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="w-7 h-7 text-zinc-500 my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Something went wrong...
                </p>  
            </div>
        )
    }

    return (
        <div ref={topRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
            {!hasNextPage && <div className="flex-1" />}
            {!hasNextPage && (
                <ChatWelcome
                    type={type}
                    name={name}
                />
            )}
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin my-4" />
                    ) : (
                        <button
                            onClick={() => fetchNextPage()}
                            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        >
                            Load previous messages
                        </button>
                    )}
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, index) => (
                    <Fragment key={index}>
                        {group?.items?.map((message: MessageWithMemberWithProfile, messageIndex: number) => {
                            const timestamp = new Date(message.createdAt);
                            const prevTimestamp = messageIndex > 0 ? new Date(group.items[messageIndex - 1].createdAt) : null;
                            
                            const isNewDay = prevTimestamp 
                              && (timestamp.getDate() !== prevTimestamp.getDate() 
                              || timestamp.getMonth() !== prevTimestamp.getMonth() 
                              || timestamp.getFullYear() !== prevTimestamp.getFullYear());
                      
                            return (
                            <Fragment key={message.id}>
                                {isNewDay && 
                                    <div className="flex items-center justify-center my-2 mx-4">
                                        <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700"></div>
                                        <span className="px-2 text-xs text-zinc-500 dark:text-zinc-400">
                                            {`The end for ${format(timestamp, SEPARATOR_DATE_FORMAT)}`}
                                        </span>
                                        <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700"></div>
                                    </div>
                                }
                            <ChatItem 
                                key={message.id}
                                id={message.id}
                                currentMember={member}
                                member={message.member}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                isEditing={editingId === message.id}
                                onEdit={() => setEditingId(message.id)}
                                onCancel={() => setEditingId(null)}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                isUpdated={message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                                />
                            </Fragment>
                        )
                        })}
                    </Fragment>
                ))}
            </div>
            {isTyping && profileId !== userId && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.1 }}
                    className="bg-white dark:bg-[#313338] fixed bottom-20 md:bottom-0 w-full flex items-center py-1 px-4">
                    <BeatLoader size={8} color={"#1E1F22"} loading={isTyping} />
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 ml-2">
                        {userName} is typing...
                    </p>
                </motion.div>
            )}
            <div ref={bottomRef} />
        </div>
    )
}