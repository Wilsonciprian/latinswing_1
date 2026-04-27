import { useState } from "react";
import { Gift, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";

const News = () => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("_subject", "New mailing-list signup — Latin Swing");
    data.append("_source", "news-page");

    setSubmitting(true);
    try {
      const res = await fetch(siteConfig.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error("Signup failed");
      toast.success("You're on the list!", {
        description: "We'll send the next giveaway and announcement straight to your inbox.",
      });
      form.reset();
    } catch {
      toast.error("Couldn't sign you up", {
        description: "Please try again, or email us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="feed-column">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          News & Giveaways
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          What's happening
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground md:text-base">
          New singles, surprise shows, and exclusive giveaways for our community.
        </p>

        {/* Featured giveaway */}
        <article className="mt-8 overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border/60">
          <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-secondary/30 via-accent/20 to-secondary/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <Gift className="h-16 w-16 text-secondary" aria-hidden />
            </div>
          </div>
          <div className="p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
              <Sparkles className="h-3 w-3" /> Giveaway
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold">
              Win a VIP Table at our next show
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              Sign up below for a chance to win a reserved VIP table for four at our next
              public show in Dallas — bottle service, front-of-stage view, and a meet &
              greet with the band. Winner announced on the 1st of next month.
            </p>
          </div>
        </article>

        {/* Signup form */}
        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl bg-muted/40 p-6 ring-1 ring-border/60"
        >
          <h3 className="font-display text-lg font-bold">Join the mailing list</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Be first to hear about new music, shows, and giveaways.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="news-name">Name</Label>
              <Input id="news-name" name="name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="news-email">Email</Label>
              <Input id="news-email" name="email" type="email" required className="mt-1" />
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 sm:w-auto"
          >
            {submitting ? "Signing up…" : "Sign me up"}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default News;
