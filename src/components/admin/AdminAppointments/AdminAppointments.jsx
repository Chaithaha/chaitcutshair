import { useState, useEffect } from 'react';
import { getAllAppointments, updateAppointment } from '../../../lib/supabaseClient';
import AppointmentDetail from '../AppointmentDetail/AppointmentDetail';
import './AdminAppointments.css';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    loadAppointments();
  }, [filters]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAllAppointments(filters);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key) => (e) => {
    setFilters(prev => ({ ...prev, [key]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', dateFrom: '', dateTo: '' });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateAppointment(id, { status: newStatus });
      loadAppointments();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <section id="admin-appointments" className="admin__section">
      <div className="admin__section-header">
        <h2 className="admin__section-title">Appointments</h2>
      </div>

      <div className="admin-appointments__filters">
        <select
          value={filters.status}
          onChange={handleFilterChange('status')}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={handleFilterChange('dateFrom')}
          placeholder="From date"
        />

        <input
          type="date"
          value={filters.dateTo}
          onChange={handleFilterChange('dateTo')}
          placeholder="To date"
        />

        <button className="admin-appointments__clear" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="admin__loading">Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="admin-appointments__empty">No appointments found</div>
      ) : (
        <div className="admin-appointments__table">
          <div className="admin-appointments__row admin-appointments__row--header">
            <div>Date</div>
            <div>Time</div>
            <div>Customer</div>
            <div>Barber</div>
            <div>Service</div>
            <div>Status</div>
            <div></div>
          </div>

          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="admin-appointments__row"
            >
              <div>{formatDate(apt.appt_time)}</div>
              <div>{formatTime(apt.appt_time)}</div>
              <div>{apt.customer_first_name} {apt.customer_last_name}</div>
              <div>
                {apt.barber?.first_name} {apt.barber?.last_name}
              </div>
              <div>{apt.service?.name}</div>
              <div onClick={(e) => e.stopPropagation()}>
                {apt.status === 'pending' ? (
                  <>
                    <button
                      className="admin-appointments__accept"
                      onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                    >
                      Accept
                    </button>
                    <span className="admin-appointments__separator">|</span>
                    <button
                      className="admin-appointments__reject"
                      onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className={`status-badge status-${apt.status}`}>
                    {apt.status}
                  </span>
                )}
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <button
                  className="admin-appointments__edit"
                  onClick={() => setSelectedAppointment(apt)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAppointment && (
        <AppointmentDetail
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onSave={loadAppointments}
        />
      )}
    </section>
  );
};

export default AdminAppointments;
