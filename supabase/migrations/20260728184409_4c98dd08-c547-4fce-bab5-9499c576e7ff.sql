
CREATE TYPE public.moderation_status AS ENUM ('pending','approved','rejected');
CREATE TYPE public.media_type AS ENUM ('image','video','audio');

-- ============ LOVE STORY ============
CREATE TABLE public.story_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  title_en text NOT NULL,
  title_ar text,
  body_en text,
  body_ar text,
  happened_on date,
  label text,
  image_url text,
  icon text,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.story_milestones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.story_milestones TO authenticated;
GRANT ALL ON public.story_milestones TO service_role;
ALTER TABLE public.story_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "story_public_read" ON public.story_milestones FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "story_admin_write" ON public.story_milestones FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_story_couple_order ON public.story_milestones(couple_id, display_order);
CREATE TRIGGER trg_story_updated BEFORE UPDATE ON public.story_milestones FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ GALLERY ============
CREATE TABLE public.gallery_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title_en text NOT NULL,
  title_ar text,
  cover_url text,
  allows_guest_uploads boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (couple_id, slug)
);
GRANT SELECT ON public.gallery_albums TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_albums TO authenticated;
GRANT ALL ON public.gallery_albums TO service_role;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "albums_public_read" ON public.gallery_albums FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "albums_admin_write" ON public.gallery_albums FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_albums_updated BEFORE UPDATE ON public.gallery_albums FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.gallery_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  album_id uuid REFERENCES public.gallery_albums(id) ON DELETE SET NULL,
  media_type public.media_type NOT NULL DEFAULT 'image',
  url text NOT NULL,
  thumbnail_url text,
  storage_path text,
  provider text NOT NULL DEFAULT 'cloudinary',
  caption_en text,
  caption_ar text,
  alt_text text,
  width integer,
  height integer,
  duration_seconds integer,
  uploaded_by_guest_name text,
  uploaded_via_qr boolean NOT NULL DEFAULT false,
  moderation public.moderation_status NOT NULL DEFAULT 'approved',
  is_featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.gallery_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_media TO authenticated;
GRANT ALL ON public.gallery_media TO service_role;
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media_public_read_approved" ON public.gallery_media FOR SELECT TO anon, authenticated USING (moderation = 'approved' OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "media_guest_upload" ON public.gallery_media FOR INSERT TO anon, authenticated WITH CHECK (moderation = 'pending');
CREATE POLICY "media_admin_write" ON public.gallery_media FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_media_album ON public.gallery_media(album_id, display_order);
CREATE INDEX idx_media_couple_mod ON public.gallery_media(couple_id, moderation);
CREATE TRIGGER trg_media_updated BEFORE UPDATE ON public.gallery_media FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ REGISTRY ============
CREATE TABLE public.registry_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  title_en text NOT NULL,
  title_ar text,
  description_en text,
  description_ar text,
  image_url text,
  external_url text,
  store_name text,
  price numeric(12,2) CHECK (price IS NULL OR price >= 0),
  currency text NOT NULL DEFAULT 'EGP',
  quantity_wanted integer NOT NULL DEFAULT 1 CHECK (quantity_wanted > 0),
  quantity_claimed integer NOT NULL DEFAULT 0 CHECK (quantity_claimed >= 0),
  allows_cash_contribution boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.registry_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registry_items TO authenticated;
GRANT ALL ON public.registry_items TO service_role;
ALTER TABLE public.registry_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "registry_public_read" ON public.registry_items FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "registry_admin_write" ON public.registry_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_registry_couple ON public.registry_items(couple_id, display_order);
CREATE TRIGGER trg_registry_updated BEFORE UPDATE ON public.registry_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.registry_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_item_id uuid NOT NULL REFERENCES public.registry_items(id) ON DELETE CASCADE,
  guest_id uuid REFERENCES public.guests(id) ON DELETE SET NULL,
  contributor_name text NOT NULL,
  contributor_email text,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  amount numeric(12,2) CHECK (amount IS NULL OR amount >= 0),
  currency text NOT NULL DEFAULT 'EGP',
  note text,
  is_anonymous boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pledged' CHECK (status IN ('pledged','paid','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.registry_contributions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registry_contributions TO authenticated;
GRANT ALL ON public.registry_contributions TO service_role;
ALTER TABLE public.registry_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contrib_public_insert" ON public.registry_contributions FOR INSERT TO anon, authenticated WITH CHECK (status = 'pledged');
CREATE POLICY "contrib_admin_read" ON public.registry_contributions FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "contrib_admin_update" ON public.registry_contributions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "contrib_admin_delete" ON public.registry_contributions FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_contrib_item ON public.registry_contributions(registry_item_id);
CREATE TRIGGER trg_contrib_updated BEFORE UPDATE ON public.registry_contributions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SEATING ============
CREATE TABLE public.seating_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  shape text NOT NULL DEFAULT 'round' CHECK (shape IN ('round','rectangle','square','head')),
  seats integer NOT NULL DEFAULT 8 CHECK (seats > 0),
  position_x numeric(8,2),
  position_y numeric(8,2),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seating_tables TO authenticated;
GRANT ALL ON public.seating_tables TO service_role;
ALTER TABLE public.seating_tables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seating_tables_admin_all" ON public.seating_tables FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_seating_tables_updated BEFORE UPDATE ON public.seating_tables FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.seat_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid NOT NULL REFERENCES public.seating_tables(id) ON DELETE CASCADE,
  guest_id uuid NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  seat_number integer CHECK (seat_number IS NULL OR seat_number > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (table_id, guest_id),
  UNIQUE (table_id, seat_number)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seat_assignments TO authenticated;
GRANT ALL ON public.seat_assignments TO service_role;
ALTER TABLE public.seat_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seat_assignments_admin_all" ON public.seat_assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_seat_guest ON public.seat_assignments(guest_id);

-- ============ MUSIC ============
CREATE TABLE public.playlist_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  title text NOT NULL,
  artist text,
  album_art_url text,
  external_url text,
  provider text CHECK (provider IS NULL OR provider IN ('spotify','youtube','apple','soundcloud','other')),
  duration_seconds integer CHECK (duration_seconds IS NULL OR duration_seconds > 0),
  is_couple_pick boolean NOT NULL DEFAULT false,
  requested_by_name text,
  moderation public.moderation_status NOT NULL DEFAULT 'pending',
  votes_count integer NOT NULL DEFAULT 0,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.playlist_tracks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playlist_tracks TO authenticated;
GRANT ALL ON public.playlist_tracks TO service_role;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tracks_public_read" ON public.playlist_tracks FOR SELECT TO anon, authenticated USING (moderation = 'approved' OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "tracks_public_request" ON public.playlist_tracks FOR INSERT TO anon, authenticated WITH CHECK (moderation = 'pending' AND is_couple_pick = false AND votes_count = 0);
CREATE POLICY "tracks_admin_write" ON public.playlist_tracks FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_tracks_couple ON public.playlist_tracks(couple_id, moderation);
CREATE TRIGGER trg_tracks_updated BEFORE UPDATE ON public.playlist_tracks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.playlist_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES public.playlist_tracks(id) ON DELETE CASCADE,
  voter_fingerprint text NOT NULL,
  guest_id uuid REFERENCES public.guests(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (track_id, voter_fingerprint)
);
GRANT INSERT ON public.playlist_votes TO anon;
GRANT SELECT, INSERT, DELETE ON public.playlist_votes TO authenticated;
GRANT ALL ON public.playlist_votes TO service_role;
ALTER TABLE public.playlist_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "votes_public_insert" ON public.playlist_votes FOR INSERT TO anon, authenticated WITH CHECK (length(voter_fingerprint) BETWEEN 8 AND 128);
CREATE POLICY "votes_admin_read" ON public.playlist_votes FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "votes_admin_delete" ON public.playlist_votes FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.sync_track_votes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.playlist_tracks SET votes_count = votes_count + 1 WHERE id = NEW.track_id;
  ELSE
    UPDATE public.playlist_tracks SET votes_count = GREATEST(votes_count - 1, 0) WHERE id = OLD.track_id;
  END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER trg_votes_sync AFTER INSERT OR DELETE ON public.playlist_votes FOR EACH ROW EXECUTE FUNCTION public.sync_track_votes();

-- ============ GUEST WALL: MESSAGES / DRAWINGS / VOICE ============
CREATE TABLE public.guest_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  guest_id uuid REFERENCES public.guests(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  body text NOT NULL CHECK (length(body) BETWEEN 1 AND 1000),
  color text NOT NULL DEFAULT '#D4AF37',
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en','ar')),
  moderation public.moderation_status NOT NULL DEFAULT 'pending',
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.guest_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_messages TO authenticated;
GRANT ALL ON public.guest_messages TO service_role;
ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_public_read" ON public.guest_messages FOR SELECT TO anon, authenticated USING (moderation = 'approved' OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "messages_public_insert" ON public.guest_messages FOR INSERT TO anon, authenticated WITH CHECK (moderation = 'pending' AND is_pinned = false);
CREATE POLICY "messages_admin_write" ON public.guest_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_messages_couple ON public.guest_messages(couple_id, moderation, created_at DESC);
CREATE TRIGGER trg_messages_updated BEFORE UPDATE ON public.guest_messages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.guest_drawings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  guest_id uuid REFERENCES public.guests(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  image_url text NOT NULL,
  storage_path text,
  stroke_count integer,
  moderation public.moderation_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.guest_drawings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_drawings TO authenticated;
GRANT ALL ON public.guest_drawings TO service_role;
ALTER TABLE public.guest_drawings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drawings_public_read" ON public.guest_drawings FOR SELECT TO anon, authenticated USING (moderation = 'approved' OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "drawings_public_insert" ON public.guest_drawings FOR INSERT TO anon, authenticated WITH CHECK (moderation = 'pending');
CREATE POLICY "drawings_admin_write" ON public.guest_drawings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_drawings_couple ON public.guest_drawings(couple_id, moderation, created_at DESC);
CREATE TRIGGER trg_drawings_updated BEFORE UPDATE ON public.guest_drawings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.voice_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  guest_id uuid REFERENCES public.guests(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  audio_url text NOT NULL,
  storage_path text,
  duration_seconds integer NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0 AND duration_seconds <= 600),
  transcript text,
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en','ar')),
  moderation public.moderation_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.voice_notes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.voice_notes TO authenticated;
GRANT ALL ON public.voice_notes TO service_role;
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "voice_public_read" ON public.voice_notes FOR SELECT TO anon, authenticated USING (moderation = 'approved' OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "voice_public_insert" ON public.voice_notes FOR INSERT TO anon, authenticated WITH CHECK (moderation = 'pending');
CREATE POLICY "voice_admin_write" ON public.voice_notes FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_voice_couple ON public.voice_notes(couple_id, moderation, created_at DESC);
CREATE TRIGGER trg_voice_updated BEFORE UPDATE ON public.voice_notes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ CONTACT ============
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  subject text,
  body text NOT NULL CHECK (length(body) BETWEEN 1 AND 4000),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_public_insert" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (is_read = false);
CREATE POLICY "contact_admin_read" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "contact_admin_update" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "contact_admin_delete" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ NOTIFICATIONS ============
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  guest_id uuid REFERENCES public.guests(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'email' CHECK (channel IN ('email','sms','whatsapp','push')),
  template_key text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  scheduled_for timestamptz,
  sent_at timestamptz,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed','cancelled')),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_admin_all" ON public.notifications FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_notifications_status ON public.notifications(status, scheduled_for);
CREATE TRIGGER trg_notifications_updated BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SETTINGS ============
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  key text NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public boolean NOT NULL DEFAULT true,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (couple_id, key)
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON public.site_settings FOR SELECT TO anon, authenticated USING (is_public = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "settings_admin_write" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ACTIVITY LOGS ============
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES public.couples(id) ON DELETE CASCADE,
  actor_id uuid,
  actor_label text,
  action text NOT NULL,
  entity_table text,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "logs_admin_read" ON public.activity_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_logs_created ON public.activity_logs(created_at DESC);

-- ============ LOCK DOWN INTERNAL FUNCTIONS ============
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.sync_track_votes() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
