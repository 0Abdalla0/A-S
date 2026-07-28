
DROP POLICY "rsvp_public_insert" ON public.rsvp_responses;
CREATE POLICY "rsvp_public_insert" ON public.rsvp_responses
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(display_name)) BETWEEN 2 AND 120
  AND party_size BETWEEN 0 AND 20
  AND source = 'website'
  AND status <> 'pending'
  AND (message IS NULL OR length(message) <= 1000)
);
