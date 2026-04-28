import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FeedPost from "./FeedPost";
import type { FeedPostData } from "@/data/posts";

const Feed = () => {
  const [posts, setPosts] = useState<FeedPostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, type, src, alt, title, description")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setPosts(
          (data ?? []).map((p: any) => ({
            id: p.id,
            type: p.type,
            src: p.src,
            alt: p.alt ?? undefined,
            title: p.title,
            description: p.description,
          }))
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="feed-column py-10" aria-busy="true">
        <div className="aspect-video w-full animate-pulse rounded-2xl bg-muted" />
        <div className="mt-5 h-7 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="feed-column py-16 text-center text-muted-foreground">
        No posts yet — check back soon.
      </section>
    );
  }

  return (
    <section aria-label="Feed">
      {posts.map((p, i) => (
        <FeedPost key={p.id} post={p} index={i} />
      ))}
      <div className="feed-column py-12 text-center text-sm text-muted-foreground">
        You've reached the end ✨
      </div>
    </section>
  );
};

export default Feed;
