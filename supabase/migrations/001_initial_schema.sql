-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Listings table
create table if not exists public.listings (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('giveaway', 'sale')),
  area text not null check (area in ('Monsey', 'Monroe', 'Brooklyn', 'Lakewood')),
  category text not null check (category in ('dining_room', 'kitchen', 'bedroom', 'sofas', 'other')),
  title text not null,
  description text not null,
  price numeric(10,2) check (
    (type = 'sale' and price is not null and price > 0) or
    (type = 'giveaway' and price is null)
  ),
  photo_urls text[] not null default '{}',
  poster_name text not null,
  poster_email text not null,
  poster_phone text not null,
  poster_address text not null,
  pin_code text not null,
  status text not null default 'pending_payment' check (
    status in ('pending_payment', 'active', 'expired', 'archived', 'removed')
  ),
  posted_at timestamptz,
  expires_at timestamptz,
  payment_id text,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Flags table
create table if not exists public.flags (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now(),
  resolved boolean not null default false,
  resolved_at timestamptz
);

-- Payments table (audit log)
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  stripe_payment_intent_id text not null unique,
  amount integer not null, -- in cents
  type text not null check (type in ('listing_fee', 'renewal_fee')),
  status text not null default 'succeeded',
  refunded boolean not null default false,
  refunded_at timestamptz,
  stripe_refund_id text,
  created_at timestamptz not null default now()
);

-- RLS policies
alter table public.listings enable row level security;
alter table public.flags enable row level security;
alter table public.payments enable row level security;

-- Listings: public can read active listings
create policy "Active listings are publicly readable"
  on public.listings for select
  using (status = 'active');

-- Listings: anyone can insert (posting flow)
create policy "Anyone can create a listing"
  on public.listings for insert
  with check (true);

-- Listings: poster can update their own listing via pin (handled server-side)
create policy "Service role can do everything"
  on public.listings for all
  using (true)
  with check (true);

-- Flags: public insert
create policy "Anyone can flag a listing"
  on public.flags for insert
  with check (true);

create policy "Service role full access to flags"
  on public.flags for all
  using (true)
  with check (true);

create policy "Service role full access to payments"
  on public.payments for all
  using (true)
  with check (true);

-- Indexes
create index if not exists idx_listings_status on public.listings(status);
create index if not exists idx_listings_area on public.listings(area);
create index if not exists idx_listings_type on public.listings(type);
create index if not exists idx_listings_expires_at on public.listings(expires_at);
create index if not exists idx_flags_listing_id on public.flags(listing_id);
create index if not exists idx_flags_resolved on public.flags(resolved);

-- Function to auto-expire listings
create or replace function expire_old_listings()
returns void language plpgsql as $$
begin
  update public.listings
  set status = 'expired'
  where status = 'active'
    and expires_at < now();
end;
$$;

-- Function to update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger listings_updated_at
  before update on public.listings
  for each row execute function update_updated_at();

-- Storage bucket for listing photos
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

-- Storage policy: public read
create policy "Public read listing photos"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

-- Storage policy: authenticated upload (service role handles this)
create policy "Anyone can upload listing photos"
  on storage.objects for insert
  with check (bucket_id = 'listing-photos');
