-- ------------------------------------------------------------
-- CLAIM EAT BUSINESS FINAL REMATES
-- ------------------------------------------------------------

alter table public.businesses
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists website text,
  add column if not exists image_url text,
  add column if not exists logo_url text;

alter table public.deals
  add column if not exists image_url text;

-- Public media buckets.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'business-images',
    'business-images',
    true,
    5242880,
    array[
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
  ),
  (
    'deal-images',
    'deal-images',
    true,
    5242880,
    array[
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Each uploaded path starts with auth.uid().
drop policy if exists
  "Business users upload ClaimEat media"
on storage.objects;

create policy
  "Business users upload ClaimEat media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in (
    'business-images',
    'deal-images'
  )
  and (
    storage.foldername(name)
  )[1] = auth.uid()::text
);

drop policy if exists
  "Business users update ClaimEat media"
on storage.objects;

create policy
  "Business users update ClaimEat media"
on storage.objects
for update
to authenticated
using (
  bucket_id in (
    'business-images',
    'deal-images'
  )
  and (
    storage.foldername(name)
  )[1] = auth.uid()::text
)
with check (
  bucket_id in (
    'business-images',
    'deal-images'
  )
  and (
    storage.foldername(name)
  )[1] = auth.uid()::text
);

drop policy if exists
  "Business users delete ClaimEat media"
on storage.objects;

create policy
  "Business users delete ClaimEat media"
on storage.objects
for delete
to authenticated
using (
  bucket_id in (
    'business-images',
    'deal-images'
  )
  and (
    storage.foldername(name)
  )[1] = auth.uid()::text
);

drop policy if exists
  "Public reads ClaimEat media"
on storage.objects;

create policy
  "Public reads ClaimEat media"
on storage.objects
for select
to public
using (
  bucket_id in (
    'business-images',
    'deal-images'
  )
);

-- Allow business members to update their store.
drop policy if exists
  "Business members update own store"
on public.businesses;

create policy
  "Business members update own store"
on public.businesses
for update
to authenticated
using (
  exists (
    select 1
    from public.business_users bu
    where bu.business_id = businesses.id
      and bu.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.business_users bu
    where bu.business_id = businesses.id
      and bu.user_id = auth.uid()
  )
);

-- Allow a business member to attach media to its own deal.
drop policy if exists
  "Business members update own deal"
on public.deals;

create policy
  "Business members update own deal"
on public.deals
for update
to authenticated
using (
  exists (
    select 1
    from public.business_users bu
    where bu.business_id = deals.business_id
      and bu.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.business_users bu
    where bu.business_id = deals.business_id
      and bu.user_id = auth.uid()
  )
);
