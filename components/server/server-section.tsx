"use client";

import { Channel, ChannelType, MemberRole, Server, Member, Profile } from "@prisma/client";
import { ServerSectionHeader } from "./server-section-header";
import { ServerChannel } from "./server-channel";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ServerMember } from "./server-member";


interface ServerSectionProps {
  contents: (Channel | (Member & { profile: Profile }))[];
  server: Server;
  role?: MemberRole;
  label: string;
  sectionType: "channels" | "members",
  channelType?: ChannelType;
}

export const ServerSection = ({
  contents,
  server,
  role,
  label,
  sectionType,
  channelType,
}: ServerSectionProps) => {
    const params = useParams();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex flex-col gap-1 mb-2">
            <ServerSectionHeader
                sectionType={sectionType}
                channelType={channelType}
                role={role}
                label={label}
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />
            <div className="px-2">
                {sectionType === "channels" && (
                    contents.map((content) => (
                    (!isCollapsed || params?.channelId === content.id) && (
                        <ServerChannel 
                        key={content.id}
                        channel={content as Channel}
                        role={role}
                        server={server}
                        />
                    )
                    ))
                )}

                {sectionType === "members" && (
                    contents.map((content) => (
                    (!isCollapsed || params?.memberId === content.id) && (
                        <ServerMember 
                        key={content.id}
                        member={content as Member & { profile: Profile }}
                        />
                    )
                    ))
                )}
            </div>
        </div>
    );
};