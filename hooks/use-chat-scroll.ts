import { useEffect, useState } from "react";

type ChatScrollProps = {
    topRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;
}

export const useChatScroll = ({
    topRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count
}: ChatScrollProps) => {
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        const topDiv = topRef?.current;

        const handleScroll = () => {
            if (!topDiv) {
                return;
            }

            const scrollTop = topDiv.scrollTop;
            if (scrollTop === 0 && shouldLoadMore) {
                loadMore();
            }
        }

        topDiv?.addEventListener("scroll", handleScroll);

        return () => {
            topDiv?.removeEventListener("scroll", handleScroll);
        }
    }, [topRef, shouldLoadMore, loadMore])

    useEffect(() => {
        const bottomDiv = bottomRef?.current;
        const topDiv = topRef?.current;
        const shouldAutoScroll = () => {
            if (!hasInitialized && bottomDiv) {
                setHasInitialized(true);
                return true;
            }

            if (!topDiv) {
                return false;
            }

            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            return distanceFromBottom <= 100;
        }

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomDiv?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [bottomRef, topRef, count, hasInitialized])
}