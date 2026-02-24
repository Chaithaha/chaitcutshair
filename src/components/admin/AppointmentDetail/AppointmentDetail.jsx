import { useState, useEffect } from 'react';
import { updateAppointment, deleteAppointment, getBarbers, getServices } from '../../../lib/supabaseClient';
import './AppointmentDetail.css';

const AppointmentDetail = ({ appointment, onClose, onSave }) => {
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    barberId: appointment.barber_id,
    serviceId: appointment.service_id,
    date: new Date(appointment.appt_time).toISOString().split('T')[0],
    time: new Date(appointment.appt_time).toTimeString().substring(0, 5),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [barbersData, servicesData] = await Promise.all([
        getBarbers(),
        getServices(),
      ]);
      setBarbers(barbersData);
      setServices(servicesData);
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apptTime = new Date(`${formData.date}T${formData.time}:00`);
      const service = services.find(s => s.id === formData.serviceId);
      const endTime = new Date(apptTime.getTime() + service.duration * 60000);

      await updateAppointment(appointment.id, {
        barber_id: formData.barberId,
        service_id: formData.serviceId,
        appt_time: apptTime.toISOString(),
        end_time: endTime.toISOString(),
      });
      onSave();
    } catch (err) {
      setError(err.message || 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleDelete = async () => {
    if (!confirm('Delete this appointment?')) return;

    try {
      await deleteAppointment(appointment.id);
      onSave();
      onClose();
    } catch (err) {
      alert('Failed to delete appointment');
    }
  };

  return (
    <div className="appointment-detail__overlay" onClick={onClose}>
      <div className="appointment-detail" onClick={(e) => e.stopPropagation()}>
        <h2 className="appointment-detail__title">Appointment Details</h2>

        <form className="appointment-detail__form" onSubmit={handleSubmit}>
          <div className="appointment-detail__info">
            <div className="appointment-detail__info-item">
              <label>Customer</label>
              <span>{appointment.customer_name}</span>
            </div>
            <div className="appointment-detail__info-item">
              <label>Email</label>
              <span>{appointment.customer_email}</span>
            </div>
            {appointment.customer_phone && (
              <div className="appointment-detail__info-item">
                <label>Phone</label>
                <span>{appointment.customer_phone}</span>
              </div>
            )}
          </div>

          <div className="appointment-detail__field">
            <label>Barber</label>
            <select value={formData.barberId} onChange={handleChange('barberId')}>
              {barbers.map(barber => (
                <option key={barber.id} value={barber.id}>
                  {barber.first_name} {barber.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="appointment-detail__field">
            <label>Service</label>
            <select value={formData.serviceId} onChange={handleChange('serviceId')}>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price}
                </option>
              ))}
            </select>
          </div>

          <div className="appointment-detail__field">
            <label>Date</label>
            <input type="date" value={formData.date} onChange={handleChange('date')} required />
          </div>

          <div className="appointment-detail__field">
            <label>Time</label>
            <input type="time" value={formData.time} onChange={handleChange('time')} required />
          </div>

          {error && <div className="appointment-detail__error">{error}</div>}

          <div className="appointment-detail__actions">
            <button type="button" className="appointment-detail__delete" onClick={handleDelete}>
              Delete
            </button>
            <button type="button" className="appointment-detail__close-btn" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="appointment-detail__save" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentDetail;
