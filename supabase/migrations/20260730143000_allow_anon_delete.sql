-- Grant DELETE privilege to anonymous users
GRANT DELETE ON public.rsvp_responses TO anon;
GRANT DELETE ON public.guest_messages TO anon;
GRANT DELETE ON public.guest_drawings TO anon;
GRANT DELETE ON public.voice_notes TO anon;

-- Create DELETE policies for anonymous users
CREATE POLICY "rsvp_anon_delete" ON public.rsvp_responses FOR DELETE TO anon USING (true);
CREATE POLICY "messages_anon_delete" ON public.guest_messages FOR DELETE TO anon USING (true);
CREATE POLICY "drawings_anon_delete" ON public.guest_drawings FOR DELETE TO anon USING (true);
CREATE POLICY "voice_anon_delete" ON public.voice_notes FOR DELETE TO anon USING (true);
