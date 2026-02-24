import { useState, useEffect } from 'react';
import { createBarber, updateBarber } from '../../../lib/supabaseClient';
import './BarberForm.css';

const BarberForm = ({ barber, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    specialty: '',
    profileImg: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (barber) {
      setFormData({
        firstName: barber.first_name || '',
        lastName: barber.last_name || '',
        email: barber.email || '',
        bio: barber.bio || '',
        specialty: barber.specialty || '',
        profileImg: barber.profile_img || '',
      });
    }
  }, [barber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        bio: formData.bio,
        specialty: formData.specialty,
        profile_img: formData.profileImg,
      };

      if (barber) {
        await updateBarber(barber.id, data);
      } else {
        await createBarber(formData);
      }
      onSave();
    } catch (err) {
      setError(err.message || 'Failed to save barber');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="barber-form__overlay" onClick={onClose}>
      <div className="barber-form" onClick={(e) => e.stopPropagation()}>
        <h2 className="barber-form__title">
          {barber ? 'Edit Barber' : 'Add Barber'}
        </h2>

        <form className="barber-form__form" onSubmit={handleSubmit}>
          <div className="barber-form__field">
            <label>First Name</label>
            <input type="text" value={formData.firstName} onChange={handleChange('firstName')} required />
          </div>

          <div className="barber-form__field">
            <label>Last Name</label>
            <input type="text" value={formData.lastName} onChange={handleChange('lastName')} required />
          </div>

          <div className="barber-form__field">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="chaitknight81@gmail.com"
              required
            />
          </div>

          <div className="barber-form__field">
            <label>Specialty</label>
            <input
              type="text"
              value={formData.specialty}
              onChange={handleChange('specialty')}
              placeholder="e.g., Fades & Beard Specialist"
            />
          </div>

          <div className="barber-form__field">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={handleChange('bio')}
              rows={4}
              placeholder="Brief description..."
            />
          </div>

          <div className="barber-form__field">
            <label>Profile Image URL</label>
            <input
              type="url"
              value={formData.profileImg}
              onChange={handleChange('profileImg')}
              placeholder="https://..."
            />
          </div>

          {error && <div className="barber-form__error">{error}</div>}

          <div className="barber-form__actions">
            <button type="button" className="barber-form__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="barber-form__submit" disabled={loading}>
              {loading ? 'Saving...' : barber ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BarberForm;
