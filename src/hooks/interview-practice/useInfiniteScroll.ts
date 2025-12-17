import { useEffect } from "react";

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  containerSelector?: string;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  loadMore,
  containerSelector = ".custom-scrollbar",
  threshold = 0.8,
}: UseInfiniteScrollProps) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector(containerSelector);
      if (!scrollContainer) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      if (scrollPercentage > threshold && hasMore && !isLoading) {
        console.log("🔄 Loading more items...");
        loadMore();
      }
    };

    const scrollContainer = document.querySelector(containerSelector);
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, isLoading, loadMore, containerSelector, threshold]);
};
