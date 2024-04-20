"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useModal } from "@/hooks/use-modal-store";

export const NavigationAction = () => {
    const { onOpen } = useModal();

    return (
        <motion.button 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpen("createServer")} 
            className="group flex items-center"
        >
            <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                <Plus className="group-hover:text-white transition text-emerald-500" size={25} />
            </div>
        </motion.button>
    );
}