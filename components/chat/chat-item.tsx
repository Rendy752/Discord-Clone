"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import Image from "next/image";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Copy, CopyCheck, Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Youtube from "react-youtube";
import { useModal } from "@/hooks/use-modal-store";
import { format, isToday, isYesterday } from "date-fns";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile
    }
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
    currentMember: Member;
    isSamePreviousMember: boolean;
    timeDifferenceInMinute: number;
    isNewDay: boolean;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="w-4 h-4 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="w-4 h-4 text-rose-500" />
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    isEditing,
    onEdit,
    onCancel,
    currentMember,
    isSamePreviousMember,
    timeDifferenceInMinute,
    isNewDay,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) => {
    const [imageUrl, setImageUrl] = useState(fileUrl);
    const [pdfUrl, setPdfUrl] = useState(fileUrl);
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();
    const [isEmoji, setIsEmoji] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const emojiRegex = /^[\p{Emoji_Presentation}]\s*$/u;
    
        if (emojiRegex.test(content.trim())) {
            setIsEmoji(true);
        } else {
            setIsEmoji(false);
        }
    }, [content]);

    const formatTimeStamp = (timestamp: string, isOnlyTime: boolean = false) => {
        const date = new Date(timestamp);
        
        if (isOnlyTime) {
            return format(date, 'h:mm a');
        }

        if (isToday(date)) {
            return `Today at ${format(date, 'h:mm a')}`;
        } else if (isYesterday(date)) {
            return `Yesterday at ${format(date, 'h:mm a')}`;
        } else {
            return format(date, 'dd MMM yyyy, h:mm a');
        }
    }

    const extractVideoId = (url: string): string => {
        let videoId = '';
    
        if (url.includes('youtu.be')) {
            videoId = url.split('youtu.be/')[1];
        } else if (url.includes('youtube.com')) {
            videoId = url.split('v=')[1];
        }
    
        if (videoId) {
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) {
                videoId = videoId.substring(0, ampersandPosition);
            }
        }
    
        return videoId;
    }

    const onMemberClick = () => {
        if (member.id === currentMember.id) {
            return;
        }

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    }

    useEffect(() => {
        if (fileUrl) {
            fetch(fileUrl)
                .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load PDF file');
                }
                })
                .catch(() => setPdfUrl('https://utfs.io/f/c5ecb4cd-cdcd-4ac4-8999-15e5d90659b0-o9bedv.jpg'));
        }
    }, [fileUrl]);

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                onCancel()
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            });

            await axios.patch(url, values);
            form.reset();
            onCancel();
        } catch (error) {
            console.log(error);
        }
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
    };

    useEffect(() => {
        form.reset({
            content
        })
    }, [content, form])

    const fileType = fileUrl?.split(".").pop();
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === "pdf" && fileUrl;
    const isImage = !isPDF && fileUrl;

    const isUrl = /^(http|https):\/\/[^ "]+$/.test(content);
    const isYouTubeLink = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/i.test(content);
    const videoId = extractVideoId(content);

    const isNewMessageHeader = (!isSamePreviousMember || (!isSamePreviousMember || timeDifferenceInMinute > 5)) || isNewDay;

    return (
        <div 
            className={cn(
                "relative group flex items-center hover:bg-black/5 my-0 px-4 py-1 transition",
                isNewMessageHeader && "mt-4"
            )}>
            <div className={cn(
                "group flex items-start",
                !fileUrl && isEditing && !isYouTubeLink && "w-full",
                !isNewMessageHeader && "justify-center",
            )}>
                {isNewMessageHeader ? (
                    <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md hover:scale-105 transition px-[14px]">
                        <UserAvatar src={member.profile.imageUrl}/>
                    </div>
                ) : (
                    <div className="absolute pt-[2px] left-[19px] md:left-[25px] hidden group-hover:flex text-xs h-13 w-13 text-zinc-500 dark:text-zinc-400">
                        {formatTimeStamp(timestamp, true)}
                    </div>
                )}
                <div 
                    className={cn(
                        "flex flex-col w-full",
                        !isNewMessageHeader && "pl-14 md:pl-[68px]"
                    )}>
                    {isNewMessageHeader && (
                        <div className="flex items-center gap-x-2">
                            <div className="flex items-center gap-x-2">
                                <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                                    {member.profile.name !== "null null" ? member.profile.name : "Anonymous"}
                                </p>  
                                <ActionTooltip label={member.role}>
                                    {roleIconMap[member.role]}
                                </ActionTooltip>
                            </div>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {formatTimeStamp(timestamp)}
                            </span>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-300",
                            isEmoji && "text-7xl",
                            deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                        )}>
                            {isUrl ? (
                                <a 
                                    className="hover:underline text-indigo-500 dark:text-indigo-400"
                                    href={content} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    {content}
                                </a>
                            ) : (
                                content
                            )}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.15 }}
                                className="flex items-center w-full gap-x-2 pt-2"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        disabled={isLoading}
                                                        className="p-2 bg-zinc-200 dark:bg-zinc-600 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                        placeholder="Edit message..."
                                                        {...field}
                                                    >
                                                    </Input>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={isLoading} size="sm" variant="primary">
                                    Save
                                </Button>
                            </motion.form>
                            <span className="text-[10px] mt-1 text-zinc-400">
                                Press esc to cancel, enter to save
                            </span>
                        </Form>
                    )}
                    {isYouTubeLink && (
                        <div className="rounded-lg overflow-hidden mb-2">
                            <Youtube
                                videoId={videoId}
                                opts={{
                                    height: '250',
                                    width: '100%',
                                }}
                            />
                        </div>
                    )}
                    {isImage && (
                        <a 
                            href={imageUrl || fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="my-1 rounded-md bg-secondary"
                        >
                            <Image 
                                src={imageUrl || fileUrl}
                                alt={content}
                                priority
                                onError={() => setImageUrl(process.env.IMAGE_ERROR_URL || "https://utfs.io/f/c5ecb4cd-cdcd-4ac4-8999-15e5d90659b0-o9bedv.jpg")}
                                width={300}
                                height={300}
                                className="object-cover border rounded-md"
                            />
                        </a>
                    )}
                    {isPDF && (
                        <div className="relative flex items-center p-2 my-2 rounded-md dark:bg-[#2B2D31] bg-[#E3E5E8]">
                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                            <a
                            href={pdfUrl || fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                            >
                            {content}
                            </a>
                        </div>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {!isImage && !isPDF && !isEditing && (
                        <ActionTooltip label={isCopied ? "Copied" : "Copy"} side="top">
                            {isCopied ? (
                                <CopyCheck 
                                    className="w-4 h-4 text-green-500 dark:text-green-400"
                                />
                            ) : (
                                <Copy 
                                    onClick={handleCopy}
                                    className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                />
                            )}
                        </ActionTooltip>
                    )}
                    {canEditMessage && (
                        <ActionTooltip label="Edit" side="top">
                            <Edit 
                                onClick={() => onEdit()}
                                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="Delete" side="top">
                        <Trash 
                            onClick={() => onOpen("deleteMessage", {
                                apiUrl: `${socketUrl}/${id}`,
                                query: socketQuery
                            })}
                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}