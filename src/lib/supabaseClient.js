import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for barbers
export const getBarbers = async () => {
  const { data, error } = await supabase
    .from('barbers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

// Helper functions for services
export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (error) throw error;
  return data;
};

// Get available time slots for a barber on a specific date
export const getAvailableSlots = async (barberId, date) => {
  // Get the barber's schedule for the date
  const { data: schedule, error: scheduleError } = await supabase
    .from('schedules')
    .select('*')
    .eq('barber_id', barberId)
    .eq('date', date)
    .single();

  if (scheduleError && scheduleError.code !== 'PGRST116') {
    throw scheduleError;
  }

  // If no schedule or not available, return empty slots
  if (!schedule || !schedule.is_available) {
    return [];
  }

  // Get existing appointments for this barber on this date
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointments')
    .select('appt_time, end_time')
    .eq('barber_id', barberId)
    .gte('appt_time', `${date}T00:00:00`)
    .lt('appt_time', `${date}T23:59:59`)
    .neq('status', 'cancelled');

  if (appointmentsError) throw appointmentsError;

  // Generate time slots based on schedule
  const slots = [];
  const [startHour] = schedule.start_time.split(':').map(Number);
  const [endHour] = schedule.end_time.split(':').map(Number);

  for (let hour = startHour; hour < endHour; hour++) {
    const slotTime = `${hour.toString().padStart(2, '0')}:00`;

    // Check if this slot is already booked
    const isBooked = appointments?.some((apt) => {
      const aptHour = new Date(apt.appt_time).getHours();
      return aptHour === hour;
    });

    slots.push({
      start_time: slotTime,
      is_available: !isBooked,
    });
  }

  return slots;
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  const { barberId, serviceId, date, time, name, email, phone } = appointmentData;

  // Get service duration
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('duration')
    .eq('id', serviceId)
    .single();

  if (serviceError) throw serviceError;

  // Calculate end time
  const [hours] = time.split(':').map(Number);
  const apptTime = new Date(`${date}T${time}:00`);
  const endTime = new Date(apptTime.getTime() + service.duration * 60000);

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      barber_id: barberId,
      service_id: serviceId,
      customer_name: name,
      customer_email: email,
      appt_time: apptTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'confirmed',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export default supabase;
