import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { MediaRoom } from "@/components/media-room";
import { initialProfile } from "@/lib/initial-profile";
interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    },
    searchParams: {
        video?: boolean;
    }
}

const MemberIdPage = async ({
    params,
    searchParams
}: MemberIdPageProps) => {
    await initialProfile();
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const profileId = profile.id;

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    });

    if (!currentMember) {
        return redirect("/");
    }

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

    if (!conversation) {
        return redirect(`/servers/${params.serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.profile?.imageUrl}
                name={otherMember.profile?.name !== "null null" ? otherMember.profile?.name : "Anonymous"}
                serverId={params.serverId}
                type="conversation"
            />
            {!searchParams.video && (
                <>
                    <ChatMessages 
                        member={currentMember}
                        name={otherMember.profile?.name !== "null null" ? otherMember.profile?.name : "Anonymous"}
                        profileId={profileId}
                        chatId={conversation.id}
                        type="conversation"
                        apiUrl="/api/direct-messages"
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId: conversation.id,
                        }}
                    />
                    <ChatInput 
                        name={otherMember.profile?.name !== "null null" ? otherMember.profile?.name : "Anonymous"}
                        type="conversation"
                        apiUrl="/api/socket/direct-messages"
                        query={{ 
                            conversationId: conversation.id,
                        }}
                    />
                </>
            )}

            {searchParams.video && (
                <MediaRoom
                    chatId={conversation.id}
                    video={true}
                    audio={true}
                />
            )}
        </div>
    )
}

export default MemberIdPage;

