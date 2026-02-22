-- Barbershop Seed Data
-- Run this after the schema migration

-- ============================================
-- SEED BARBERS
-- ============================================
INSERT INTO public.barbers (id, first_name, last_name, bio, specialty, is_active) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Marcus',
    'Johnson',
    '10+ years crafting perfect fades. Marcus believes every client deserves a cut that turns heads.',
    'Fades & Beard Specialist',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'David',
    'Chen',
    'Trained in traditional barbering techniques with a modern edge. David specializes in timeless looks.',
    'Classic Cuts & Styling',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Trey',
    'Williams',
    'The creative force behind our most intricate designs. Trey transforms hair into art.',
    'Designs & Creative Cuts',
    true
  );

-- ============================================
-- SEED SERVICES
-- ============================================
INSERT INTO public.services (id, name, price, duration, is_active) VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    'Precision Haircut',
    35.00,
    45,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Beard Sculpting',
    15.00,
    30,
    true
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'The Full Package',
    45.00,
    75,
    true
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Junior Cut',
    25.00,
    30,
    true
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'Custom Design',
    20.00,
    60,
    true
  );

-- ============================================
-- SEED SCHEDULES (Next 14 days for all barbers)
-- ============================================
DO $$
DECLARE
  barber_record RECORD;
  day_offset INTEGER;
  schedule_date DATE;
BEGIN
  FOR barber_record IN SELECT id FROM public.barbers LOOP
    FOR day_offset IN 0..13 LOOP
      schedule_date := CURRENT_DATE + day_offset;

      -- Skip Sundays (day 0 of week)
      IF EXTRACT(DOW FROM schedule_date) != 0 THEN
        INSERT INTO public.schedules (barber_id, date, start_time, end_time, is_available)
        VALUES (
          barber_record.id,
          schedule_date,
          '09:00:00',
          '18:00:00',
          true
        );
      END IF;
    END LOOP;
  END LOOP;
END $$;
