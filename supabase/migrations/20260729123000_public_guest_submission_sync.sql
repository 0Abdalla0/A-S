CREATE POLICY "rsvp_public_read" ON public.rsvp_responses
FOR SELECT TO anon, authenticated
USING (source = 'website');

DROP POLICY "messages_public_insert" ON public.guest_messages;
CREATE POLICY "messages_public_insert" ON public.guest_messages
FOR INSERT TO anon, authenticated
WITH CHECK (
  moderation IN ('pending', 'approved')
  AND is_pinned = false
);

DROP POLICY "drawings_public_insert" ON public.guest_drawings;
CREATE POLICY "drawings_public_insert" ON public.guest_drawings
FOR INSERT TO anon, authenticated
WITH CHECK (moderation IN ('pending', 'approved'));

DROP POLICY "voice_public_insert" ON public.voice_notes;
CREATE POLICY "voice_public_insert" ON public.voice_notes
FOR INSERT TO anon, authenticated
WITH CHECK (moderation IN ('pending', 'approved'));
