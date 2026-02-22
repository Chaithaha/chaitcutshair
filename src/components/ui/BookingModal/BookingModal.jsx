/**
 * BookingModal Component
 *
 * A modal for booking appointments with barbers.
 * Connected to Supabase for real data.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Object} props.preselectedBarber - Optional preselected barber
 * @returns {JSX.Element} The booking modal
 */

import { useState, useEffect } from 'react';
import { getBarbers, getServices, getAvailableSlots, createAppointment } from '../../../lib/supabaseClient';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, preselectedBarber }) => {
  const [step, setStep] = useState(1); // 1: Select barber, 2: Booking form
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBarbers, setLoadingBarbers] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
  });

  // Fetch barbers and services on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barbersData, servicesData] = await Promise.all([
          getBarbers(),
          getServices(),
        ]);
        setBarbers(barbersData);
        setServices(servicesData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoadingBarbers(false);
        setLoadingServices(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Handle preselected barber
  useEffect(() => {
    if (preselectedBarber && isOpen) {
      setSelectedBarber(preselectedBarber);
      setStep(2);
    }
  }, [preselectedBarber, isOpen]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedBarber(null);
      setFormData({
        serviceId: '',
        date: '',
        time: '',
        name: '',
        email: '',
        phone: '',
      });
      setError(null);
      setSuccess(false);
      setAvailableSlots([]);
    }
  }, [isOpen]);

  // Load available slots when date is selected
  useEffect(() => {
    const fetchSlots = async () => {
      if (formData.date && selectedBarber) {
        setLoadingSlots(true);
        try {
          const slots = await getAvailableSlots(selectedBarber.id, formData.date);
          setAvailableSlots(slots);
        } catch (err) {
          console.error('Failed to load slots:', err);
          setAvailableSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      }
    };

    fetchSlots();
  }, [formData.date, selectedBarber]);

  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedBarber(null);
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date, time: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.serviceId || !formData.date || !formData.time || !formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await createAppointment({
        barberId: selectedBarber.id,
        serviceId: formData.serviceId,
        date: formData.date,
        time: formData.time,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const formatTime = (time) => {
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  if (!isOpen) return null;

  return (
    <div className="booking-modal__overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="booking-modal__header">
          <div>
            {step === 2 && (
              <button className="booking-modal__back" onClick={handleBack}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            )}
            <h2 className="booking-modal__title">
              {step === 1 ? 'Choose Your Barber' : `Book with ${selectedBarber?.first_name}`}
            </h2>
            {step === 2 && selectedBarber?.specialty && (
              <p className="booking-modal__subtitle">{selectedBarber.specialty}</p>
            )}
          </div>
          <button className="booking-modal__close" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="booking-modal__content">
          {success ? (
            <div className="booking-modal__success">
              <div className="booking-modal__success-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3>Booking Confirmed!</h3>
              <p>Check your email for confirmation details.</p>
            </div>
          ) : step === 1 ? (
            /* Barber Selection */
            <div className="booking-modal__barbers">
              {loadingBarbers ? (
                <p className="booking-modal__loading">Loading barbers...</p>
              ) : (
                barbers.map((barber) => (
                  <button
                    key={barber.id}
                    className="booking-modal__barber-card"
                    onClick={() => handleBarberSelect(barber)}
                  >
                    <div className="booking-modal__barber-image">
                      {barber.profile_img ? (
                        <img src={barber.profile_img} alt={`${barber.first_name} ${barber.last_name}`} />
                      ) : (
                        <div className="booking-modal__barber-placeholder">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="8" r="5" />
                            <path d="M20 21a8 8 0 1 0-16 0" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="booking-modal__barber-info">
                      <span className="booking-modal__barber-name">{barber.first_name} {barber.last_name}</span>
                      <span className="booking-modal__barber-specialty">{barber.specialty}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            /* Booking Form */
            <form className="booking-modal__form" onSubmit={handleSubmit}>
              {/* Service Selection */}
              <div className="booking-modal__field">
                <label>Select Service</label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  required
                >
                  <option value="">Choose a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div className="booking-modal__field">
                <label>Select Date</label>
                <input
                  type="date"
                  min={getMinDate()}
                  max={getMaxDate()}
                  value={formData.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                />
              </div>

              {/* Time Selection */}
              {formData.date && (
                <div className="booking-modal__field">
                  <label>Select Time</label>
                  {loadingSlots ? (
                    <p className="booking-modal__loading">Loading available times...</p>
                  ) : availableSlots.length === 0 ? (
                    <p className="booking-modal__no-slots">No available slots for this date. Please select another date.</p>
                  ) : (
                    <div className="booking-modal__time-grid">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.start_time}
                          type="button"
                          disabled={!slot.is_available}
                          onClick={() => setFormData({ ...formData, time: slot.start_time })}
                          className={`booking-modal__time-slot ${
                            formData.time === slot.start_time ? 'booking-modal__time-slot--selected' : ''
                          } ${!slot.is_available ? 'booking-modal__time-slot--unavailable' : ''}`}
                        >
                          {formatTime(slot.start_time)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contact Info */}
              <div className="booking-modal__field">
                <label>Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="booking-modal__field">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="booking-modal__field">
                <label>Phone (optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Error Message */}
              {error && <div className="booking-modal__error">{error}</div>}

              {/* Submit Button */}
              <button
                type="submit"
                className="booking-modal__submit"
                disabled={loading || !formData.time}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
