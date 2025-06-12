ALTER TABLE public.inventory
ADD COLUMN IF NOT EXISTS inv_status JSONB DEFAULT '{"status": "Operational", "updated_at": null}'::JSONB;