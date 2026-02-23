-- Add optional customer_phone column to appointments table
ALTER TABLE public.appointments
ADD COLUMN customer_phone TEXT;

-- Add index for phone lookups (optional, useful for searching by phone)
CREATE INDEX idx_appointments_phone ON public.appointments(customer_phone);
