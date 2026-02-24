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
      customer_phone: phone || null,
      appt_time: apptTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'confirmed',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ============================================
// ADMIN CRUD FUNCTIONS
// ============================================

// Barbers CRUD
export const updateBarber = async (id, updates) => {
  const { data, error } = await supabase
    .from('barbers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBarber = async (id) => {
  const { error } = await supabase
    .from('barbers')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const createBarber = async (barberData) => {
  const { data, error } = await supabase
    .from('barbers')
    .insert({
      first_name: barberData.firstName,
      last_name: barberData.lastName,
      bio: barberData.bio || null,
      specialty: barberData.specialty || null,
      profile_img: barberData.profileImg || null,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Schedules CRUD
export const updateSchedule = async (barberId, date, updates) => {
  const { data, error } = await supabase
    .from('schedules')
    .upsert({
      barber_id: barberId,
      date,
      ...updates,
    }, {
      onConflict: 'barber_id,date'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getBarberSchedules = async (barberId, startDate, endDate) => {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('barber_id', barberId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date');

  if (error) throw error;
  return data;
};

// Appointments CRUD
export const getAllAppointments = async (filters = {}) => {
  let query = supabase
    .from('appointments')
    .select(`
      *,
      barber:barbers(id, first_name, last_name),
      service:services(id, name, price)
    `)
    .order('appt_time', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.barberId) {
    query = query.eq('barber_id', filters.barberId);
  }
  if (filters.dateFrom) {
    query = query.gte('appt_time', filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte('appt_time', filters.dateTo);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const updateAppointment = async (id, updates) => {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export default supabase;
