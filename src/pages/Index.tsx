import Layout from "@/components/Layout";
import InfiniteFeed from "@/components/InfiniteFeed";
import { siteConfig } from "@/config/site";

const Index = () => {
  return (
    <Layout>
      <header className="feed-column pt-2 text-center md:pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          {siteConfig.tagline}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground md:text-base">
          Scroll the feed — videos, photos, and stories from the stage.
        </p>
      </header>
      <div className="mt-6">
        <InfiniteFeed />
      </div>
    </Layout>
  );
};

export default Index;
