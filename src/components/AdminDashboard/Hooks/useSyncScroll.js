import { useEffect, useRef } from 'react';

const useSyncScroll = (enabled = true) => {
    const scrollContainerRef = useRef(null);
    const fakeScrollbarRef = useRef(null);

    useEffect(() => {
        if (!enabled) return;

        const scrollContainer = scrollContainerRef.current;
        const fakeScrollbar = fakeScrollbarRef.current;

        if (!scrollContainer || !fakeScrollbar) return;

        const syncScroll = () => {
            fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;
        };
        const syncFakeScroll = () => {
            scrollContainer.scrollLeft = fakeScrollbar.scrollLeft;
        };

        fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;

        scrollContainer.addEventListener('scroll', syncScroll);
        fakeScrollbar.addEventListener('scroll', syncFakeScroll);

        return () => {
            scrollContainer.removeEventListener('scroll', syncScroll);
            fakeScrollbar.removeEventListener('scroll', syncFakeScroll);
        };
    }, [enabled]);

    return { scrollContainerRef, fakeScrollbarRef };
};

export default useSyncScroll;
