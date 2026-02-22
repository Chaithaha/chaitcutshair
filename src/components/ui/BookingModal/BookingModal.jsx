/**
 * BookingModal Component
 *
 * A modal for booking appointments with barbers.
 * Currently uses dummy data - will be replaced with Supabase integration.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @returns {JSX.Element} The booking modal
 */

import { useState, useEffect } from 'react';
import './BookingModal.css';

// Dummy barbers data (will be replaced with Supabase)
const DUMMY_BARBERS = [
  {
    id: '1',
    name: 'Marcus Johnson',
    specialty: 'Fades & Beard Specialist',
    image: null, // Placeholder
  },
  {
    id: '2',
    name: 'David Chen',
    specialty: 'Classic Cuts & Styling',
    image: null, // Placeholder
  },
  {
    id: '3',
    name: 'Trey Williams',
    specialty: 'Designs & Creative Cuts',
    image: null, // Placeholder
  },
];

// Dummy services data (will be replaced with Supabase)
const DUMMY_SERVICES = [
  { id: '1', name: 'Haircut', price: 35 },
  { id: '2', name: 'Beard Trim', price: 15 },
  { id: '3', name: 'Haircut + Beard', price: 45 },
  { id: '4', name: 'Kids Cut', price: 25 },
  { id: '5', name: 'Design', price: 20 },
];

// Generate dummy time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    slots.push({
      start_time: `${hour.toString().padStart(2, '0')}:00`,
      is_available: Math.random() > 0.3, // Random availability
    });
  }
  return slots;
};

const BookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Select barber, 2: Booking form
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [services] = useState(DUMMY_SERVICES);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
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
    }
  }, [isOpen]);

  // Load available slots when date is selected
  useEffect(() => {
    if (formData.date) {
      // Simulate loading slots (will be replaced with Supabase)
      setAvailableSlots(generateTimeSlots());
    }
  }, [formData.date]);

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

    // Simulate booking creation (will be replaced with Supabase)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Replace with Supabase booking creation
      console.log('Booking created:', {
        barber: selectedBarber,
        ...formData,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError('Failed to create booking. Please try again.');
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
              {step === 1 ? 'Choose Your Barber' : `Book with ${selectedBarber?.name}`}
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
              {DUMMY_BARBERS.map((barber) => (
                <button
                  key={barber.id}
                  className="booking-modal__barber-card"
                  onClick={() => handleBarberSelect(barber)}
                >
                  <div className="booking-modal__barber-image">
                    {barber.image ? (
                      <img src={barber.image} alt={barber.name} />
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
                    <span className="booking-modal__barber-name">{barber.name}</span>
                    <span className="booking-modal__barber-specialty">{barber.specialty}</span>
                  </div>
                </button>
              ))}
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
