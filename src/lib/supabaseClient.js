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

// Get count of active barbers
export const getBarberCount = async () => {
  const { count, error } = await supabase
    .from('barbers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (error) throw error;
  return count || 0;
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
  const { barberId, serviceId, date, time, firstName, lastName, email, phone, formattedTime, formattedDate } = appointmentData;

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
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_email: email,
      customer_phone: phone || null,
      appt_time: apptTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'pending',
    })
    .select(`
      *,
      barber:barbers(id, first_name, last_name, email),
      service:services(id, name, price)
    `)
    .single();

  if (error) throw error;

  // Send confirmation emails
  try {
    await supabase.functions.invoke('send-booking-email', {
      body: {
        type: 'new_booking',
        appointment: {
          ...data,
          formatted_time: formattedTime,
          formatted_date: formattedDate,
        },
        barberEmail: data.barber.email,
      },
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });
  } catch (emailError) {
    console.error('Failed to send email:', emailError);
  }

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
      email: barberData.email,
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

// Weekly Availability CRUD
export const getWeeklyAvailability = async (barberId) => {
  const { data, error } = await supabase
    .from('weekly_availability')
    .select('*')
    .eq('barber_id', barberId)
    .order('day_of_week');

  if (error) throw error;
  return data;
};

// Get available dates for a barber within a date range
export const getAvailableDates = async (barberId, startDate, endDate) => {
  // Get weekly availability (default working days)
  const { data: weeklyAvail, error: weeklyError } = await supabase
    .from('weekly_availability')
    .select('*')
    .eq('barber_id', barberId);

  if (weeklyError) throw weeklyError;

  // Convert to a map for quick lookup
  const weeklyMap = {};
  weeklyAvail?.forEach(a => {
    weeklyMap[a.day_of_week] = a;
  });

  // Get schedule overrides for the date range
  const { data: schedules, error: schedulesError } = await supabase
    .from('schedules')
    .select('*')
    .eq('barber_id', barberId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (schedulesError) throw schedulesError;

  // Convert schedules to a map
  const scheduleMap = {};
  schedules?.forEach(s => {
    scheduleMap[s.date] = s;
  });

  // Generate list of dates and their availability
  const availableDates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    const dayOfWeek = current.getDay();
    const schedule = scheduleMap[dateStr];
    const weekly = weeklyMap[dayOfWeek];

    // Determine availability:
    // - If schedule exists, use its is_available
    // - Else if weekly availability exists and is_available, date is available
    // - Else not available
    let isAvailable = false;

    if (schedule) {
      isAvailable = schedule.is_available;
    } else if (weekly?.is_available) {
      isAvailable = true;
    }

    if (isAvailable) {
      availableDates.push({
        date: dateStr,
        dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: current.getDate(),
        month: current.toLocaleDateString('en-US', { month: 'short' }),
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return availableDates;
};

export const updateWeeklyAvailability = async (barberId, dayOfWeek, updates) => {
  const { data, error } = await supabase
    .from('weekly_availability')
    .upsert({
      barber_id: barberId,
      day_of_week: dayOfWeek,
      ...updates,
    }, {
      onConflict: 'barber_id,day_of_week'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const setWeeklyAvailability = async (barberId, availability) => {
  // availability is an array of { dayOfWeek, isAvailable, startTime, endTime }
  const records = availability.map(a => ({
    barber_id: barberId,
    day_of_week: a.dayOfWeek,
    is_available: a.isAvailable,
    start_time: a.startTime || '09:00',
    end_time: a.endTime || '18:00',
  }));

  const { data, error } = await supabase
    .from('weekly_availability')
    .upsert(records, {
      onConflict: 'barber_id,day_of_week'
    })
    .select();

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
      barber:barbers(id, first_name, last_name, email),
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

export const deleteAppointment = async (id) => {
  // First fetch appointment details for email
  const { data: appointment } = await supabase
    .from('appointments')
    .select(`
      *,
      barber:barbers(id, first_name, last_name, email),
      service:services(id, name)
    `)
    .eq('id', '')
    .single();

  // Delete the appointment
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Send cancellation email to barber
  if (appointment?.barber?.email) {
    try {
      await supabase.functions.invoke('send-booking-email', {
        body: {
          type: 'cancelled',
          appointment: appointment,
          barberEmail: appointment.barber.email,
        },
      });
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
    }
  }
};

// ============================================
// STORAGE UPLOAD FUNCTIONS
// ============================================

/**
 * Upload a barber profile image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} barberId - Optional barber ID for organizing files
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadBarberImage = async (file, barberId = null) => {
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = barberId
    ? `${barberId}/${Date.now()}.${fileExt}`
    : `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('CCHbucket')
    .upload(`barbers/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('CCHbucket')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};

/**
 * Delete a barber image from Supabase Storage
 * @param {string} url - The public URL of the image to delete
 */
export const deleteBarberImage = async (url) => {
  try {
    // Extract path from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/CCHbucket/')[1];
    if (!pathParts) return;

    await supabase.storage.from('CCHbucket').remove([pathParts]);
  } catch (err) {
    console.error('Failed to delete image:', err);
    // Don't throw - image deletion is not critical
  }
};

export default supabase;
