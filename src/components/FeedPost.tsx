import { useEffect, useRef, useState } from "react";
import type { FeedPostData } from "@/data/posts";

type Props = { post: FeedPostData; index: number };

const FeedPost = ({ post, index }: Props) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isYouTubeId = post.type === "video" && !/^https?:\/\//.test(post.src);
  const embedSrc = isYouTubeId
    ? `https://www.youtube.com/embed/${post.src}?rel=0&modestbranding=1`
    : post.src;

  return (
    <article
      ref={ref}
      className={`feed-column py-10 ${visible ? "fade-in-up" : "opacity-0"}`}
      style={{ animationDelay: `${Math.min(index, 4) * 60}ms` }}
    >
      {/* MEDIA */}
      <div className="overflow-hidden rounded-2xl shadow-soft ring-1 ring-border/60">
        {post.type === "video" ? (
          <div className="relative aspect-video w-full bg-muted">
            <iframe
              src={embedSrc}
              title={post.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ) : (
          <img
            src={post.src}
            alt={post.alt ?? post.title}
            loading="lazy"
            className="block h-auto w-full"
          />
        )}
      </div>

      {/* TITLE */}
      <h2 className="mt-5 font-display text-2xl font-extrabold leading-tight md:text-3xl">
        {post.title}
      </h2>

      {/* DESCRIPTION */}
      <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-[17px]">
        {post.description}
      </p>

      {/* Soft divider */}
      <div className="mx-auto mt-10 h-px w-24 bg-border" aria-hidden />
    </article>
  );
};

export default FeedPost;
