import { useEffect, useRef, useState } from "react";
import { posts } from "@/data/posts";
import FeedPost from "./FeedPost";

const PAGE = posts.length;

const InfiniteFeed = () => {
  const [pages, setPages] = useState(1);
  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPages((p) => Math.min(p + 1, 20)); // cap to avoid runaway DOM
        }
      },
      { rootMargin: "600px 0px 600px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = Array.from({ length: pages * PAGE }, (_, i) => {
    const post = posts[i % PAGE];
    return { ...post, key: `${post.id}-${i}` };
  });

  return (
    <section aria-label="Feed">
      {items.map((p, i) => (
        <FeedPost key={p.key} post={p} index={i} />
      ))}
      <div ref={sentinel} aria-hidden className="h-20" />
    </section>
  );
};

export default InfiniteFeed;
