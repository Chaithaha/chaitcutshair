-- Barbershop Booking System Schema
-- Created: 2026-02-22

-- ============================================
-- BARBERS TABLE
-- ============================================
CREATE TABLE public.barbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    bio TEXT,
    specialty TEXT,
    profile_img TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for filtering active barbers
CREATE INDEX idx_barbers_is_active ON public.barbers(is_active);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    is_active BOOLEAN DEFAULT true
);

-- Index for filtering active services
CREATE INDEX idx_services_is_active ON public.services(is_active);

-- ============================================
-- SCHEDULES TABLE
-- ============================================
CREATE TABLE public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(barber_id, date) -- One schedule per barber per day
);

-- Indexes for schedule lookups
CREATE INDEX idx_schedules_barber_id ON public.schedules(barber_id);
CREATE INDEX idx_schedules_date ON public.schedules(date);
CREATE INDEX idx_schedules_barber_date ON public.schedules(barber_id, date);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    appt_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for appointment lookups
CREATE INDEX idx_appointments_barber_id ON public.appointments(barber_id);
CREATE INDEX idx_appointments_date ON public.appointments(appt_time);
CREATE INDEX idx_appointments_barber_time ON public.appointments(barber_id, appt_time);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_email ON public.appointments(customer_email);

-- ============================================
-- DOUBLE BOOKING PREVENTION
-- ============================================
-- This function checks for overlapping appointments
CREATE OR REPLACE FUNCTION check_appointment_overlap()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if there's any overlapping appointment for the same barber
    -- that is not cancelled
    IF EXISTS (
        SELECT 1 FROM public.appointments
        WHERE barber_id = NEW.barber_id
        AND id != NEW.id
        AND status != 'cancelled'
        AND (
            (NEW.appt_time < end_time AND NEW.end_time > appt_time)
        )
    ) THEN
        RAISE EXCEPTION 'This time slot is already booked. Please select another time.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent double bookings
CREATE TRIGGER prevent_double_booking
    BEFORE INSERT OR UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION check_appointment_overlap();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Barbers: Public read, admin write (for now, allow all)
CREATE POLICY "barbers_public_read" ON public.barbers
    FOR SELECT USING (true);

CREATE POLICY "barbers_all_write" ON public.barbers
    FOR ALL USING (true);

-- Services: Public read, admin write (for now, allow all)
CREATE POLICY "services_public_read" ON public.services
    FOR SELECT USING (true);

CREATE POLICY "services_all_write" ON public.services
    FOR ALL USING (true);

-- Schedules: Public read, admin write (for now, allow all)
CREATE POLICY "schedules_public_read" ON public.schedules
    FOR SELECT USING (true);

CREATE POLICY "schedules_all_write" ON public.schedules
    FOR ALL USING (true);

-- Appointments: Allow all for now (will restrict later with auth)
CREATE POLICY "appointments_all" ON public.appointments
    FOR ALL USING (true);

-- ============================================
-- REALTIME REPLICATION
-- ============================================
-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.barbers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.schedules;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
