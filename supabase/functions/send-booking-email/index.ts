import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const resendApiKey = Deno.env.get('RESEND_API_KEY');

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sendEmail({ to, subject, html }: EmailRequest) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ChaitCutsHair <chaitcutshair@omgchait.com>',
      to,
      subject,
      html,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Failed to send email to', to, ':', result);
    throw new Error(result.message || 'Failed to send email');
  }

  console.log('Successfully sent email to:', to);
  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, appointment, barberEmail } = await req.json();

    if (type === 'new_booking') {
      const dateStr = new Date(appointment.appt_time).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const timeStr = new Date(appointment.appt_time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      // Customer email
      const customerEmail = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://chaithairshair.com/logo.png" alt="ChaitCutsHair" style="height: 60px;" />
          </div>
          <h1 style="color: #000; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-size: 24px;">Booking Confirmed</h1>
          <p style="color: #666;">Hi ${appointment.customer_first_name} ${appointment.customer_last_name},</p>
          <p style="color: #000;">Your appointment has been booked:</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border: 1px solid #000;">
            <p style="margin: 5px 0;"><strong>Barber:</strong> ${appointment.barber.first_name} ${appointment.barber.last_name}</p>
            <p style="margin: 5px 0;"><strong>Service:</strong> ${appointment.service.name}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${dateStr}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${timeStr}</p>
          </div>
          <p style="color: #000;">We'll see you then!</p>
          <p style="color: #666; font-size: 12px;">ChaitCutsHair</p>
        </div>
      `;
      await sendEmail({ to: appointment.customer_email, subject: 'Booking Confirmed - ChaitCutsHair', html: customerEmail });

      // Barber email
      const barberEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-size: 24px;">New Booking</h1>
          <p style="color: #000;">You have a new appointment:</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border: 1px solid #000;">
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${appointment.customer_first_name} ${appointment.customer_last_name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${appointment.customer_email}</p>
            ${appointment.customer_phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${appointment.customer_phone}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Service:</strong> ${appointment.service.name}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${dateStr}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${timeStr}</p>
          </div>
        </div>
      `;
      await sendEmail({ to: barberEmail, subject: `New Booking: ${appointment.customer_first_name} ${appointment.customer_last_name}`, html: barberEmailHtml });

    } else if (type === 'cancelled') {
      const dateStr = new Date(appointment.appt_time).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const timeStr = new Date(appointment.appt_time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      const cancelledEmail = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-size: 24px;">Booking Cancelled</h1>
          <p style="color: #000;">The following appointment has been cancelled:</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border: 1px solid #000;">
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${appointment.customer_first_name} ${appointment.customer_last_name}</p>
            <p style="margin: 5px 0;"><strong>Barber:</strong> ${appointment.barber?.first_name} ${appointment.barber?.last_name}</p>
            <p style="margin: 5px 0;"><strong>Service:</strong> ${appointment.service?.name}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${dateStr}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${timeStr}</p>
          </div>
        </div>
      `;
      await sendEmail({ to: barberEmail, subject: 'Booking Cancelled - ChaitCutsHair', html: cancelledEmail });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
