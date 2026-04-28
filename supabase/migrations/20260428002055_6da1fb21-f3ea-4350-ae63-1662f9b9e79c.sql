
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Updated-at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('video','image')),
  src TEXT NOT NULL,
  alt TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert posts"
  ON public.posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update posts"
  ON public.posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete posts"
  ON public.posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_posts_sort_order ON public.posts (sort_order);

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media','media', true);

CREATE POLICY "Media is publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Seed initial posts
INSERT INTO public.posts (type, src, alt, title, description, sort_order) VALUES
('video','dQw4w9WgXcQ',NULL,'Wedding Celebration','A high-energy Merengue set that turned the reception into a packed dance floor from the very first downbeat. Vibrant percussion, layered horns, and call-and-response vocals kept guests of every age moving until the final song. The bride and groom shared the floor with grandparents, kids, and surprise guests, and the night wrapped with a roaring conga line that wound through the entire venue. Pure celebration, start to finish.',10),
('image','https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1280&q=80','Live Latin band performing at a corporate gala','Corporate Gala — Downtown Dallas','An elegant evening for a Fortune 500 client that began with cocktail-hour bossa and bolero, then shifted into full Salsa and Merengue as the night took off. Our seven-piece lineup read the room beat for beat, mixing crowd-favorite classics with originals. Executives traded blazers for the dance floor, and the company''s CEO requested an encore well past the planned set. Polished, professional, and unforgettable.',20),
('video','L_jWHffIx5E',NULL,'Studio Session — New Single Coming Soon','Behind the scenes of our newest original recording: a slow-burn Salsa romántica that builds into an explosive montuno. We tracked live brass, three-part vocal harmonies, and a percussion section that filled the studio with energy you can feel through the speakers. Producer notes, dance breaks, and a lot of café cubano fueled the late-night sessions. Drop is coming soon — hit the News page to hear it first.',30),
('image','https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1280&q=80','Festival main stage at sunset with cheering crowd','Festival Mainstage at Sunset','Headlining the Latin block at a regional festival under a perfect Texas sunset. Thousands of fans, a massive sound system, and a setlist designed to peak right as the sky turned gold. We opened with a Bachata medley, climbed through Salsa standards, and closed with a twelve-minute Merengue jam featuring an extended timbales solo. One of those nights the band will remember for a long, long time.',40),
('image','https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&w=1280&q=80','Quinceañera celebration with live band','Quinceañera Celebration','A traditional waltz for the father-daughter dance, then straight into the celebration the family had been dreaming of for months. Our band led the surprise choreography, kept the energy high through dinner with smooth Latin jazz, and lit up the dance floor for the rest of the night. Families who hadn''t danced together in years closed out the evening hand in hand. These are the nights we live for.',50);
