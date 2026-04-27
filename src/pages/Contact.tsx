import { useState } from "react";
import { Mail } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("_subject", "New booking inquiry — Latin Swing Dallas");

    setSubmitting(true);
    try {
      const res = await fetch(siteConfig.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error("Submit failed");
      toast.success("Message sent!", {
        description: "We'll get back to you within 1–2 business days.",
      });
      form.reset();
    } catch {
      toast.error("Couldn't send your message", {
        description: `Please email us directly at ${siteConfig.email}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="feed-column">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          Contact
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Let's make your event unforgettable
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground md:text-base">
          Tell us about your event and we'll be in touch shortly. Or email us directly.
        </p>

        <a
          href={`mailto:${siteConfig.email}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
        >
          <Mail className="h-4 w-4" />
          {siteConfig.email}
        </a>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl bg-card p-6 shadow-soft ring-1 ring-border/60"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" name="phone" type="tel" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="event_type">Event type</Label>
              <Input
                id="event_type"
                name="event_type"
                placeholder="Wedding, corporate, festival…"
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="event_date">Event date</Label>
              <Input id="event_date" name="event_date" type="date" className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell us about your event, venue, guest count, and what you're looking for."
                className="mt-1"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 sm:w-auto"
          >
            {submitting ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Contact;
