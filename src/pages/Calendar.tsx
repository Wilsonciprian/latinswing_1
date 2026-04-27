import { useEffect, useState } from "react";
import { Calendar as CalIcon, MapPin, RefreshCw, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type GCalEvent = {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
};

function formatWhen(ev: GCalEvent) {
  const startStr = ev.start?.dateTime ?? ev.start?.date;
  if (!startStr) return "";
  const start = new Date(startStr);
  const allDay = !ev.start?.dateTime;
  const dateFmt: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const timeFmt: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };
  if (allDay) return start.toLocaleDateString(undefined, dateFmt);
  return `${start.toLocaleDateString(undefined, dateFmt)} · ${start.toLocaleTimeString(undefined, timeFmt)}`;
}

const CalendarPage = () => {
  const [events, setEvents] = useState<GCalEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("calendar-events");
      if (error) throw error;
      setEvents((data as { events: GCalEvent[] }).events ?? []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load calendar";
      setError(msg);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <div className="feed-column">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Upcoming
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Calendar
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Synced live from our Google Calendar.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={load}
            disabled={loading}
            aria-label="Refresh"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          {loading && events === null && (
            <SkeletonList />
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
              Couldn't load the calendar right now. Please try again shortly.
            </div>
          )}

          {!loading && events && events.length === 0 && !error && (
            <div className="rounded-2xl bg-muted/60 p-6 text-center text-muted-foreground ring-1 ring-border/60">
              <CalIcon className="mx-auto mb-3 h-6 w-6" aria-hidden />
              No upcoming events posted yet. Check back soon!
            </div>
          )}

          {events?.map((ev) => (
            <article
              key={ev.id}
              className="rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/60"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                {formatWhen(ev)}
              </p>
              <h2 className="mt-1 font-display text-xl font-bold leading-tight">
                {ev.summary ?? "Untitled event"}
              </h2>
              {ev.location && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" aria-hidden />
                  {ev.location}
                </p>
              )}
              {ev.description && (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                  {ev.description}
                </p>
              )}
              {ev.htmlLink && (
                <a
                  href={ev.htmlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
                >
                  Add to calendar <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
};

const SkeletonList = () => (
  <>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="h-32 animate-pulse rounded-2xl bg-muted/60 ring-1 ring-border/60"
      />
    ))}
  </>
);

export default CalendarPage;
