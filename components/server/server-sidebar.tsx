import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { ServerSection } from "./server-section";

interface ServerSideBarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 g-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 g-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 g-4 w-4" />,
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
}

export const ServerSideBar = async ({
    serverId
}: ServerSideBarProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc',
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: 'asc',
                },
            },
        }
    });

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);

    // Remove the current profile from the members list
    const members = server?.members.filter((member) => member.profileId !== profile.id);

    if (!server) {
        return redirect("/");
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader server={server} role={role} />
            <ScrollArea className="flex-1 px-1">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member.profile.id,
                                    name: member.profile.name !== "null null" ? member.profile.name : 'Anonymous',
                                    icon: roleIconMap[member.role],
                                })),
                            },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                {!!textChannels?.length && (
                    <ServerSection
                        contents={textChannels}
                        server={server}
                        role={role}
                        label="Text Channels"
                        sectionType="channels"
                        channelType={ChannelType.TEXT}
                    />
                )}
                {!!audioChannels?.length && (
                    <ServerSection
                        contents={audioChannels}
                        server={server}
                        role={role}
                        label="Voice Channels"
                        sectionType="channels"
                        channelType={ChannelType.AUDIO}
                    />
                )}
                {!!videoChannels?.length && (
                    <ServerSection
                        contents={videoChannels}
                        server={server}
                        role={role}
                        label="Video Channels"
                        sectionType="channels"
                        channelType={ChannelType.VIDEO}
                    />
                )}
                {!!members?.length && (
                    <ServerSection
                        contents={members}
                        server={server}
                        role={role}
                        label="Members"
                        sectionType="members"
                        channelType={ChannelType.TEXT}
                    />
                )}
            </ScrollArea>
        </div>
    );
}