
# Latin Swing Dallas — Band Website

A clean, mobile-friendly site for **Latin Swing Dallas** (Merengue / Salsa / Latin) built around a single seamless vertical "infinity scroll" feed. Light, professional base with subtle animated confetti/particles for that "corporate but fun" energy.

## Layout & Navigation

- **Desktop:** fixed top bar — logo on the left, menu on the right.
- **Mobile:** persistent bottom tab bar with icons + labels.
- **Menu items (both):** Home (Feed), About, Calendar, News, Contact.
- **Background:** off-white base with a slow-drifting confetti particle layer behind all content (CSS-animated, low opacity, brand colors).

## Pages

### 1. Home — Infinity Scroll Feed
The centerpiece. A single narrow column (~640px max), no cards, no grid — just a continuous flow. Each post is a strict vertical stack:

```text
┌──────────────────────────┐
│        MEDIA             │  ← video embed (YouTube) or image
│  (responsive, rounded)   │
└──────────────────────────┘
   Title (large, bold)
   Short description, ~5–6
   lines of body copy that
   sets the scene and invites
   the reader to keep scrolling.
   ─────────────────────────  ← thin divider, generous whitespace
       (next post, fades in)
```

- Posts live in a typed `src/data/posts.ts` array — easy to edit later.
- Seed with the **"Wedding Celebration" Merengue** post + a few placeholders (live show, studio session, behind-the-scenes).
- IntersectionObserver fades posts in as they enter view and loops the array as the user nears the bottom so scrolling feels endless.

### 2. About
Band story, members, photo, short bio for Latin Swing Dallas.

### 3. Calendar — synced with Google Calendar
- Connected to **latinswingdallas@gmail.com** via the Google Calendar connector (primary calendar, all events).
- A Supabase Edge Function fetches upcoming events through the secure connector gateway (no API keys in the browser).
- Page shows a clean vertical list of upcoming gigs: **date · time · title · venue/location · description**, with an "Add to Calendar" link.
- Read-only on the site — the band manages everything from Google Calendar; the website updates automatically.
- Light caching for speed; manual refresh button available.

### 4. News (freestyle: signups & giveaways)
- Hero blurb area for announcements.
- Featured giveaway card (image + title + description + CTA).
- Email signup form (also routed through Formspree → Gmail).

### 5. Contact Us
- Form fields: name, email, phone (optional), event type, event date, message.
- Submits to **Formspree**, which forwards to your Gmail.
- Success/error feedback via toast.

## Visual Style

- Palette: warm off-white background, deep navy text, vibrant tropical accent (coral / turquoise) for links, buttons, and confetti dots.
- Typography: clean modern sans, heavier display weight for post titles.
- Motion: confetti drift in the background, fade-in on scroll for posts, gentle hover scale on nav and buttons.
- All colors and tokens defined in `index.css` + `tailwind.config.ts` (no hardcoded hex in components).

## Technical Details

- React + Vite + Tailwind + shadcn/ui (already in project).
- Routes added under `/`, `/about`, `/calendar`, `/news`, `/contact`.
- New components: `TopNav`, `BottomNav`, `ConfettiBackground`, `FeedPost`, `InfiniteFeed`, `CalendarList`, `ContactForm`, `SignupForm`.
- **Lovable Cloud** enabled for the Edge Function that proxies Google Calendar through the connector gateway.
- Posts data: `src/data/posts.ts` (typed `{ id, type: 'video'|'image', src, title, description }`).
- Formspree endpoint stored as a single constant for easy swap; no backend needed for the forms.

## What you'll need to provide after approval

1. **Google Calendar connection** — when prompted, sign in with `latinswingdallas@gmail.com` to authorize read access to the primary calendar.
2. **Formspree form ID** — create a free form at formspree.io configured to forward to your Gmail; paste the ID when asked. Same endpoint will be reused for the News email signup.
3. *(Optional)* real band bio, member names, real video URLs — otherwise believable placeholders go in, easily edited in one file.
