import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";

import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { initialProfile } from "@/lib/initial-profile";

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    };
}

const ChannelIdPage = async ({
    params
}: ChannelIdPageProps) => {
    await initialProfile();
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const profileId = profile.id;

    const server = await db.server.findUnique({
        where: {
            id: params.serverId
        }
    });

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        }
    });

    if (!server || !channel || !member) {
        redirect("/");
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader 
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages 
                        member={member}
                        profileId={profileId}
                        name={channel.name}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />
                    <ChatInput 
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/socket/messages"
                        query={{ 
                            channelId: params.channelId,
                            channelName: channel.name,
                            serverId: params.serverId,
                            serverName: server.name,
                        }}
                    />
                </>
            )}

            {channel.type === ChannelType.AUDIO && (
                <MediaRoom
                    chatId={channel.id}
                    video={false}
                    audio={true}
                />
            )}

            {channel.type === ChannelType.VIDEO && (
                <MediaRoom
                    chatId={channel.id}
                    video={true}
                    audio={true}
                />
            
            )}
        </div>
    );
}

export default ChannelIdPage;