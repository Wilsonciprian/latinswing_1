import { corsHeaders } from "@supabase/supabase-js/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const GOOGLE_CALENDAR_API_KEY = Deno.env.get("GOOGLE_CALENDAR_API_KEY");
    if (!GOOGLE_CALENDAR_API_KEY) throw new Error("GOOGLE_CALENDAR_API_KEY is not configured");

    const timeMin = new Date().toISOString();
    const params = new URLSearchParams({
      timeMin,
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "50",
    });

    const url = `${GATEWAY_URL}/calendars/primary/events?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_CALENDAR_API_KEY,
      },
    });

    const body = await res.json();
    if (!res.ok) {
      throw new Error(`Google Calendar API failed [${res.status}]: ${JSON.stringify(body)}`);
    }

    return new Response(
      JSON.stringify({ events: body.items ?? [] }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("calendar-events error:", message);
    return new Response(
      JSON.stringify({ error: message, events: [] }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
