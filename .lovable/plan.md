## Two changes to the home feed

### 1) Stop the infinite loop
The feed currently repeats the same posts up to 20 times. Change it so the feed renders each post exactly once, then ends — no looping, no auto-repeat. Add a small "You've reached the end" message at the bottom.

### 2) Admin: add / edit / delete media
Move the feed content from the static `src/data/posts.ts` file into the database so you can manage it from the website itself.

**Backend (Lovable Cloud)**
- New `posts` table: `id`, `type` (video/image), `src`, `alt`, `title`, `description`, `sort_order`, `created_at`.
- New `media` storage bucket for uploaded images.
- Row-Level Security:
  - Anyone can read posts (so the public feed works).
  - Only signed-in admins can insert / update / delete.
- A `user_roles` table + `has_role()` function so we can mark you as admin (no role data on profiles).

**Authentication**
- Add email + password login (no email confirmation, so you can sign in immediately).
- A simple `/auth` page (sign in / sign up).
- After your first signup, I'll grant your account the `admin` role via a migration.

**Admin UI**
- New `/admin` route, visible only to admins.
- Lists all posts with drag-or-arrow reordering.
- "New post" form:
  - Type: Image (upload file) or Video (paste YouTube ID or URL).
  - Title, description, alt text.
- Edit + delete buttons on each post.
- A small "Admin" link in the nav appears only when you're signed in as admin.

**Public feed**
- `InfiniteFeed` becomes just `Feed` — fetches posts from the database, ordered by `sort_order`, renders once, stops.
- Loading skeleton while fetching; friendly empty state if there are no posts yet.
- Existing 5 posts from `posts.ts` will be seeded into the database so nothing disappears.

### Files touched
- New: `supabase` migration (tables, RLS, storage bucket, seed), `src/pages/Auth.tsx`, `src/pages/Admin.tsx`, `src/components/AdminPostForm.tsx`, `src/hooks/useAdmin.ts`.
- Edited: `src/components/InfiniteFeed.tsx` (rename + DB fetch + no loop), `src/components/Nav.tsx` (admin link), `src/App.tsx` (routes), `src/pages/Index.tsx` (copy tweak).
- `src/data/posts.ts` kept temporarily only as the seed source, then can be removed.

### What I'll need from you after approval
1. Sign up once on the new `/auth` page — tell me the email you used so I can grant admin.
2. Confirm: ok to disable email confirmation so signup → instant access? (recommended for a single-admin site).
