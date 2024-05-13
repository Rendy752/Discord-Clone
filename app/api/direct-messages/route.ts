import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage, Member, Profile } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

type MessageWithPrevNext = DirectMessage & {
    member: Member & {
        profile: Profile;
    };
    prevMessage: DirectMessage | null;
    nextMessage: DirectMessage | null;
};

export async function GET (
    req: Request
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");
        const page = parseInt(searchParams.get("page") || "1");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID missing", { status: 400 });
        }

        let messages: MessageWithPrevNext[] = [];

        if (cursor) {
            const rawMessages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });

            messages = rawMessages.map(messages => ({
                ...messages,
                prevMessage: null,
                nextMessage: null
            }));
        } else {
            const rawMessages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });

            messages = rawMessages.map(messages => ({
                ...messages,
                prevMessage: null,
                nextMessage: null
            }));
        }

        let nextCursor = null;

        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[messages.length - 1].id;
        }

        let firstMessageOfNextPage: DirectMessage | null = null;
        const nextMessages = await db.directMessage.findMany({
            take: 1,
            skip: page * MESSAGES_BATCH,
            where: {
                conversationId,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        firstMessageOfNextPage = nextMessages[0];

        let lastMessageOfPreviousPage: DirectMessage | null = null;

        const previousMessages = await db.directMessage.findMany({
            take: 1,
            skip: Math.max(0, (page - 1) * MESSAGES_BATCH - 1),
            where: {
                conversationId,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        lastMessageOfPreviousPage = previousMessages[0];

        // descending order
        let isLastPage = messages.length !== MESSAGES_BATCH;
        let isFirstPage = page === 1;
        messages.forEach((message, index) => {
        if (index === 0) {
            if (!isFirstPage) {
                message.nextMessage = lastMessageOfPreviousPage;
            }
            message.prevMessage = messages[index + 1];
        } else if (index === messages.length - 1) {
            if (!isLastPage) {
                message.prevMessage = firstMessageOfNextPage;
            }
            message.nextMessage = messages[index - 1];
            lastMessageOfPreviousPage = message;
        } else {
            message.nextMessage = messages[index - 1];
            message.prevMessage = messages[index + 1];
        }

        });

        messages = messages.map(message => ({
            ...message,
            member: {
                ...message.member,
                profile: {
                    ...message.member.profile,
                },
            },
            prevMessage: message.prevMessage ? {
                id: message.prevMessage.id,
                content: message.prevMessage.content,
                fileUrl: message.prevMessage.fileUrl,
                memberId: message.prevMessage.memberId,
                conversationId: message.prevMessage.conversationId,
                replyToId: message.prevMessage.replyToId,
                deleted: message.prevMessage.deleted,
                createdAt: message.prevMessage.createdAt,
                updatedAt: message.prevMessage.updatedAt
            } : null,
            nextMessage: message.nextMessage ? {
                id: message.nextMessage.id,
                content: message.nextMessage.content,
                fileUrl: message.nextMessage.fileUrl,
                memberId: message.nextMessage.memberId,
                conversationId: message.nextMessage.conversationId,
                replyToId: message.nextMessage.replyToId,
                deleted: message.nextMessage.deleted,
                createdAt: message.nextMessage.createdAt,
                updatedAt: message.nextMessage.updatedAt
            } : null,
        }));

        return NextResponse.json({
            items: messages,
            nextCursor
        });
    } catch (error) {
        console.log("[DIRECT_MESSAGES_GET]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}