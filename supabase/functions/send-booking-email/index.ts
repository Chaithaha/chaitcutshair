import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

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
      // Use client-formatted strings if available (preserves user's timezone)
      const dateStr = appointment.formatted_date || new Date(appointment.appt_time).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const timeStr = appointment.formatted_time || new Date(appointment.appt_time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      // Customer email - Modern branded design
      const customerEmail = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmed</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #0a0a0a;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0a0a0a;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.5);">

                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); padding: 48px 40px; text-align: center; border-bottom: 1px solid #222;">
                      <!-- Logo -->
                      <div style="margin-bottom: 24px;">
                        <img src="https://nkelkwpwfovufxjpvqjy.supabase.co/storage/v1/object/public/CCHbucket/logo.png" alt="CHAITcutsHair" style="height: 48px; display: block; margin: 0 auto;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
                        <div style="display: none; font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #fff; text-transform: uppercase;">CHAIT<span style="color: #666;">cuts</span>Hair</div>
                      </div>
                      <h1 style="margin: 0; font-size: 14px; font-weight: 600; letter-spacing: 3px; color: #888; text-transform: uppercase;">Booking Confirmed</h1>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 48px 40px;">
                      <p style="margin: 0 0 12px 0; font-size: 16px; color: #fff;">Hey ${appointment.customer_first_name},</p>
                      <p style="margin: 0 0 32px 0; font-size: 16px; color: #888; line-height: 1.6;">Your appointment has been booked. Here are the details:</p>

                      <!-- Appointment Details Card -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #222;">
                        <tr>
                          <td style="padding: 32px;">
                            <!-- Detail Row: Barber -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td style="padding-bottom: 20px; border-bottom: 1px solid #222;">
                                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #666; text-transform: uppercase;">Barber</p>
                                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #fff;">${appointment.barber.first_name} ${appointment.barber.last_name}</p>
                                </td>
                              </tr>
                            </table>

                            <!-- Detail Row: Service -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td style="padding: 20px 0; border-bottom: 1px solid #222;">
                                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #666; text-transform: uppercase;">Service</p>
                                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #fff;">${appointment.service.name}</p>
                                </td>
                              </tr>
                            </table>

                            <!-- Detail Row: Date & Time -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td style="padding-top: 20px;">
                                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #666; text-transform: uppercase;">Date & Time</p>
                                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #fff;">${dateStr}</p>
                                  <p style="margin: 4px 0 0 0; font-size: 16px; color: #888;">${timeStr}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA Section -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 40px;">
                        <tr>
                          <td style="text-align: center;">
                            <p style="margin: 0 0 24px 0; font-size: 14px; color: #888;">Need to make changes? Reply to this email.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 32px 40px; background-color: #0a0a0a; border-top: 1px solid #222; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #555;">© 2026 CHAITcutsHair. All rights reserved.</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
      await sendEmail({ to: appointment.customer_email, subject: 'Booking Confirmed - CHAITcutsHair', html: customerEmail });

      // Barber email - Modern design with customer info
      const barberEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #0a0a0a;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0a0a0a;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.5);">

                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); padding: 48px 40px; text-align: center; border-bottom: 1px solid #222;">
                      <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #fff 0%, #ccc 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                      <h1 style="margin: 0; font-size: 14px; font-weight: 600; letter-spacing: 3px; color: #888; text-transform: uppercase;">New Booking Alert</h1>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 48px 40px;">
                      <p style="margin: 0 0 32px 0; font-size: 16px; color: #888; line-height: 1.6;">You have a new appointment request:</p>

                      <!-- Customer Details Card -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #222;">
                        <tr>
                          <td style="padding: 32px;">
                            <!-- Customer Name -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td style="padding-bottom: 20px; border-bottom: 1px solid #222;">
                                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #666; text-transform: uppercase;">Customer</p>
                                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #fff;">${appointment.customer_first_name} ${appointment.customer_last_name}</p>
                                </td>
                              </tr>
                            </table>

                            <!-- Contact Info -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td style="padding: 20px 0; border-bottom: 1px solid #222;">
                                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #666; text-transform: uppercase;">Email</p>
                                  <p style="margin: 0; font-size: 16px; color: #fff;">${appointment.customer_email}</p>
                                  ${appointment.customer_phone ? `<p style="margin: 8px 0 0 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #666; text-transform: uppercase;">Phone</p>
                                  <p style="margin: 4px 0 0 0; font-size: 16px; color: #fff;">${appointment.customer_phone}</p>` : ''}
                                </td>
                              </tr>
                            </table>

                            <!-- Service -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td style="padding: 20px 0; border-bottom: 1px solid #222;">
                                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #666; text-transform: uppercase;">Service</p>
                                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #fff;">${appointment.service.name}</p>
                                </td>
                              </tr>
                            </table>

                            <!-- Date & Time -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td style="padding-top: 20px;">
                                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #666; text-transform: uppercase;">Date & Time</p>
                                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #fff;">${dateStr}</p>
                                  <p style="margin: 4px 0 0 0; font-size: 16px; color: #888;">${timeStr}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 32px 40px; background-color: #0a0a0a; border-top: 1px solid #222; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #555;">CHAITcutsHair Booking System</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Cancelled</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #0a0a0a;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0a0a0a;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.5);">

                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #2a1a1a 0%, #1a0a0a 100%); padding: 48px 40px; text-align: center; border-bottom: 1px solid #331111;">
                      <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
                          <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                      </div>
                      <h1 style="margin: 0; font-size: 14px; font-weight: 600; letter-spacing: 3px; color: #ff6666; text-transform: uppercase;">Booking Cancelled</h1>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 48px 40px;">
                      <p style="margin: 0 0 32px 0; font-size: 16px; color: #888; line-height: 1.6;">The following appointment has been cancelled:</p>

                      <!-- Appointment Details Card -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #331111;">
                        <tr>
                          <td style="padding: 32px;">
                            <!-- Customer -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td style="padding-bottom: 20px; border-bottom: 1px solid #221111;">
                                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #666; text-transform: uppercase;">Customer</p>
                                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #fff;">${appointment.customer_first_name} ${appointment.customer_last_name}</p>
                                </td>
                              </tr>
                            </table>

                            <!-- Barber -->
                            ${appointment.barber ? `
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td style="padding: 20px 0; border-bottom: 1px solid #221111;">
                                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #666; text-transform: uppercase;">Barber</p>
                                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #fff;">${appointment.barber.first_name} ${appointment.barber.last_name}</p>
                                </td>
                              </tr>
                            </table>
                            ` : ''}

                            <!-- Service -->
                            ${appointment.service ? `
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td style="padding: 20px 0; border-bottom: 1px solid #221111;">
                                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #666; text-transform: uppercase;">Service</p>
                                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #fff;">${appointment.service.name}</p>
                                </td>
                              </tr>
                            </table>
                            ` : ''}

                            <!-- Date & Time -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td style="padding-top: 20px;">
                                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #666; text-transform: uppercase;">Date & Time</p>
                                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #fff;">${dateStr}</p>
                                  <p style="margin: 4px 0 0 0; font-size: 16px; color: #888;">${timeStr}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 32px 40px; background-color: #0a0a0a; border-top: 1px solid #222; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #555;">CHAITcutsHair Booking System</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
      await sendEmail({ to: barberEmail, subject: 'Booking Cancelled - CHAITcutsHair', html: cancelledEmail });
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
