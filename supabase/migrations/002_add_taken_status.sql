-- Allow 'taken' as a valid listing status
ALTER TABLE public.listings
  DROP CONSTRAINT IF EXISTS listings_status_check;

ALTER TABLE public.listings
  ADD CONSTRAINT listings_status_check CHECK (
    status in ('pending_payment', 'active', 'expired', 'archived', 'removed', 'taken')
  );
