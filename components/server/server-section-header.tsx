"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { ChevronDown, ChevronRight, Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionHeaderProps {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
    isCollapsed: boolean;
    onToggle: () => void;
}

export const ServerSectionHeader = ({
    label,
    role,
    sectionType,
    channelType,
    server,
    isCollapsed,
    onToggle,
}: ServerSectionHeaderProps) => {
    const { onOpen } = useModal();

    return (
        <div 
            onClick={onToggle}
            className="flex items-center justify-between p-1 rounded-2xl hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
        >
            <div className="flex items-center gap-1">
                {isCollapsed ? <ChevronRight className="w-3 h-3 text-zinc-500 dark:text-zinc-400" /> : <ChevronDown className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />}
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {label}
                </p>
            </div>
            {role !==MemberRole.GUEST && sectionType == "channels" && (
                <ActionTooltip label="Create Channel" side="top">
                    <button 
                        onClick={e => {
                            e.stopPropagation();
                            onOpen("createChannel", { channelType });
                        }}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label="Manage Members" side="top">
                    <button 
                        onClick={e => {
                            e.stopPropagation();
                            onOpen("members", { server });
                        }}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
    );
}