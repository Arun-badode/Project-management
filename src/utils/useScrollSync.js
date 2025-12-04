import { useEffect } from "react";

export const useScrollSync = (refs = []) => {
  useEffect(() => {
    if (!refs.length) return;

    const handleScroll = (source) => {
      refs.forEach((ref) => {
        if (ref.current && ref.current !== source) {
          ref.current.scrollTop = source.scrollTop;
          ref.current.scrollLeft = source.scrollLeft;
        }
      });
    };

    const listeners = refs.map((ref) => {
      if (ref.current) {
        const el = ref.current;
        const onScroll = () => handleScroll(el);
        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
      }
      return () => {};
    });

    return () => {
      listeners.forEach((fn) => fn());
    };
  }, [refs]);
};
