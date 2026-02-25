import { useState, useEffect, useRef } from 'react';
import { createBarber, updateBarber, uploadBarberImage } from '../../../lib/supabaseClient';
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
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

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
      setImagePreview(barber.profile_img || null);
    } else {
      setImagePreview(null);
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

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setError(null);

    // Upload to Supabase Storage
    setUploading(true);
    try {
      const publicUrl = await uploadBarberImage(file, barber?.id);
      setFormData({ ...formData, profileImg: publicUrl });
    } catch (err) {
      setError(err.message || 'Failed to upload image');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, profileImg: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
              placeholder="chaitcutshair@omgchait.com"
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
            <label>Profile Image</label>
            <div className="barber-form__upload">
              {imagePreview ? (
                <div className="barber-form__preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="barber-form__remove-image"
                    onClick={handleRemoveImage}
                    disabled={uploading}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="barber-form__upload-btn">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                </label>
              )}
            </div>
            <p className="barber-form__hint">JPEG, PNG, WebP or GIF. Max 5MB.</p>
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
