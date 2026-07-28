
CREATE TYPE public.app_role AS ENUM ('admin','editor','viewer');
CREATE TYPE public.rsvp_status AS ENUM ('pending','attending','tentative','declined');
CREATE TYPE public.event_type AS ENUM ('engagement','ceremony','reception','after_party','henna','rehearsal','brunch','other');
CREATE TYPE public.invitation_status AS ENUM ('draft','sent','opened','responded','cancelled');
CREATE TYPE public.guest_side AS ENUM ('bride','groom','both');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TABLE public.couples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  bride_first_name_en text NOT NULL,
  bride_first_name_ar text,
  bride_last_name_en text,
  groom_first_name_en text NOT NULL,
  groom_first_name_ar text,
  groom_last_name_en text,
  bride_bio_en text,
  bride_bio_ar text,
  groom_bio_en text,
  groom_bio_ar text,
  bride_photo_url text,
  groom_photo_url text,
  hashtag text,
  main_event_at timestamptz NOT NULL,
  timezone text NOT NULL DEFAULT 'Africa/Cairo',
  contact_email text,
  contact_phone text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT couples_email_chk CHECK (contact_email IS NULL OR contact_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);
GRANT SELECT ON public.couples TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.couples TO authenticated;
GRANT ALL ON public.couples TO service_role;
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
CREATE POLICY "couples_public_read" ON public.couples FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "couples_admin_write" ON public.couples FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_couples_updated BEFORE UPDATE ON public.couples FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  name_en text NOT NULL,
  name_ar text,
  address_en text,
  address_ar text,
  city text,
  country text,
  maps_query text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  phone text,
  parking_notes_en text,
  parking_notes_ar text,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT venues_lat_chk CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
  CONSTRAINT venues_lng_chk CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180)
);
GRANT SELECT ON public.venues TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.venues TO authenticated;
GRANT ALL ON public.venues TO service_role;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "venues_public_read" ON public.venues FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "venues_admin_write" ON public.venues FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_venues_couple ON public.venues(couple_id);
CREATE TRIGGER trg_venues_updated BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  event_type public.event_type NOT NULL DEFAULT 'other',
  title_en text NOT NULL,
  title_ar text,
  description_en text,
  description_ar text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  dress_code_en text,
  dress_code_ar text,
  is_public boolean NOT NULL DEFAULT true,
  requires_rsvp boolean NOT NULL DEFAULT true,
  capacity integer,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT events_time_chk CHECK (ends_at IS NULL OR ends_at > starts_at),
  CONSTRAINT events_capacity_chk CHECK (capacity IS NULL OR capacity > 0)
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public_read" ON public.events FOR SELECT TO anon, authenticated USING (is_public = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "events_admin_write" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_events_couple_start ON public.events(couple_id, starts_at);
CREATE INDEX idx_events_venue ON public.events(venue_id);
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.schedule_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title_en text NOT NULL,
  title_ar text,
  description_en text,
  description_ar text,
  icon text,
  starts_at timestamptz NOT NULL,
  duration_minutes integer CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.schedule_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedule_items TO authenticated;
GRANT ALL ON public.schedule_items TO service_role;
ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "schedule_public_read" ON public.schedule_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "schedule_admin_write" ON public.schedule_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_schedule_event ON public.schedule_items(event_id, starts_at);
CREATE TRIGGER trg_schedule_updated BEFORE UPDATE ON public.schedule_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.guest_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  name text NOT NULL,
  side public.guest_side NOT NULL DEFAULT 'both',
  max_guests integer NOT NULL DEFAULT 1 CHECK (max_guests > 0),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_groups TO authenticated;
GRANT ALL ON public.guest_groups TO service_role;
ALTER TABLE public.guest_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "guest_groups_admin_all" ON public.guest_groups FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_guest_groups_couple ON public.guest_groups(couple_id);
CREATE TRIGGER trg_guest_groups_updated BEFORE UPDATE ON public.guest_groups FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  group_id uuid REFERENCES public.guest_groups(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  full_name_ar text,
  email text,
  phone text,
  side public.guest_side NOT NULL DEFAULT 'both',
  relationship text,
  is_plus_one boolean NOT NULL DEFAULT false,
  plus_one_of uuid REFERENCES public.guests(id) ON DELETE SET NULL,
  is_child boolean NOT NULL DEFAULT false,
  dietary_notes text,
  language_preference text NOT NULL DEFAULT 'en' CHECK (language_preference IN ('en','ar')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT guests_email_chk CHECK (email IS NULL OR email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);
CREATE UNIQUE INDEX idx_guests_couple_email ON public.guests(couple_id, lower(email)) WHERE email IS NOT NULL;
CREATE INDEX idx_guests_group ON public.guests(group_id);
CREATE INDEX idx_guests_couple ON public.guests(couple_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO authenticated;
GRANT ALL ON public.guests TO service_role;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "guests_admin_all" ON public.guests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_guests_updated BEFORE UPDATE ON public.guests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  group_id uuid REFERENCES public.guest_groups(id) ON DELETE CASCADE,
  guest_id uuid REFERENCES public.guests(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  status public.invitation_status NOT NULL DEFAULT 'draft',
  channel text NOT NULL DEFAULT 'link' CHECK (channel IN ('link','email','sms','whatsapp','print')),
  allowed_guests integer NOT NULL DEFAULT 1 CHECK (allowed_guests > 0),
  personal_message_en text,
  personal_message_ar text,
  sent_at timestamptz,
  first_opened_at timestamptz,
  opened_count integer NOT NULL DEFAULT 0,
  responded_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT invitations_target_chk CHECK (group_id IS NOT NULL OR guest_id IS NOT NULL)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitations TO authenticated;
GRANT ALL ON public.invitations TO service_role;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invitations_admin_all" ON public.invitations FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_invitations_group ON public.invitations(group_id);
CREATE INDEX idx_invitations_guest ON public.invitations(guest_id);
CREATE INDEX idx_invitations_status ON public.invitations(status);
CREATE TRIGGER trg_invitations_updated BEFORE UPDATE ON public.invitations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.rsvp_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  invitation_id uuid REFERENCES public.invitations(id) ON DELETE SET NULL,
  guest_id uuid REFERENCES public.guests(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  email text,
  phone text,
  status public.rsvp_status NOT NULL DEFAULT 'pending',
  party_size integer NOT NULL DEFAULT 1 CHECK (party_size >= 0 AND party_size <= 20),
  meal_preference text,
  dietary_notes text,
  song_request text,
  message text,
  needs_transport boolean NOT NULL DEFAULT false,
  needs_accommodation boolean NOT NULL DEFAULT false,
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en','ar')),
  source text NOT NULL DEFAULT 'website',
  responded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT rsvp_email_chk CHECK (email IS NULL OR email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);
CREATE UNIQUE INDEX idx_rsvp_guest_event ON public.rsvp_responses(guest_id, event_id) WHERE guest_id IS NOT NULL AND event_id IS NOT NULL;
CREATE INDEX idx_rsvp_couple_status ON public.rsvp_responses(couple_id, status);
CREATE INDEX idx_rsvp_event ON public.rsvp_responses(event_id);
GRANT INSERT ON public.rsvp_responses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsvp_responses TO authenticated;
GRANT ALL ON public.rsvp_responses TO service_role;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rsvp_public_insert" ON public.rsvp_responses FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "rsvp_admin_read" ON public.rsvp_responses FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "rsvp_admin_update" ON public.rsvp_responses FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "rsvp_admin_delete" ON public.rsvp_responses FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_rsvp_updated BEFORE UPDATE ON public.rsvp_responses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
