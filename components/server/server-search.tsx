"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
    data: {
        label: string;
        type: "channel" | "member";
        data: {
            icon: React.ReactNode;
            name: string;
            id: string;
        }[] | undefined
    }[]
}

export const ServerSearch = ({
    data
}: ServerSearchProps ) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        }

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const onClick = ({ id, type }: { id: string; type: "channel" | "member" }) => {
        setOpen(false);

        if (type === 'member') {
            router.push(`/servers/${params?.serverId}/conversations/${id}`);
        }

        if (type === 'channel') {
            router.push(`/servers/${params?.serverId}/channels/${id}`);
        }
    }

    return (
        <>
            <motion.button
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }} 
                onClick={() => setOpen(true)}
                className="group px-2 py-2 rounded-xl flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
            >
                <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                    Search
                </p>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground ml-auto">
                    Ctrl + K
                </kbd>
            </motion.button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search all channels and members" />
                <CommandList>
                    <CommandEmpty>
                        No result found
                    </CommandEmpty>
                    {data.map(({label, type, data}) => {
                        if (!data?.length) return null;

                        return (
                            <CommandGroup key={label} heading={label}>
                                {data.map(({id, icon, name}) => {
                                    return (
                                        <div 
                                            key={id} 
                                            style={{ cursor: 'pointer' }}
                                            onMouseDown={() => onClick({ id, type })}
                                        >
                                            <CommandItem onSelect={() => onClick({ id, type })}>
                                                {icon}
                                                <span>{name}</span>
                                            </CommandItem>
                                        </div>
                                    )
                                })}
                            </CommandGroup>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    );
}