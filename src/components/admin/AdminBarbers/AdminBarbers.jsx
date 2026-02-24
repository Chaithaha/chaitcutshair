import { useState, useEffect } from 'react';
import { getBarbers, deleteBarber } from '../../../lib/supabaseClient';
import BarberForm from '../BarberForm/BarberForm';
import './AdminBarbers.css';

const AdminBarbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBarber, setEditingBarber] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadBarbers = async () => {
    try {
      const data = await getBarbers();
      setBarbers(data);
    } catch (err) {
      console.error('Failed to load barbers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBarbers();
  }, []);

  const handleAdd = () => {
    setEditingBarber(null);
    setShowForm(true);
  };

  const handleEdit = (barber) => {
    setEditingBarber(barber);
    setShowForm(true);
  };

  const handleDelete = async (barber) => {
    if (!confirm(`Delete ${barber.first_name} ${barber.last_name}?`)) return;

    try {
      await deleteBarber(barber.id);
      await loadBarbers();
    } catch (err) {
      alert('Failed to delete barber');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBarber(null);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingBarber(null);
    loadBarbers();
  };

  if (loading) return <div className="admin__loading">Loading...</div>;

  return (
    <section id="admin-barbers" className="admin__section">
      <div className="admin__section-header">
        <h2 className="admin__section-title">Barbers</h2>
        <button className="admin__button" onClick={handleAdd}>+ Add Barber</button>
      </div>

      <div className="admin-barbers__grid">
        {barbers.map((barber) => (
          <article key={barber.id} className="admin-barbers__card">
            <div className="admin-barbers__card-image">
              {barber.profile_img ? (
                <img src={barber.profile_img} alt={`${barber.first_name} ${barber.last_name}`} />
              ) : (
                <div className="admin-barbers__card-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="12" cy="8" r="5" />
                    <path d="M20 21a8 8 0 1 0-16 0" />
                  </svg>
                </div>
              )}
            </div>

            <div className="admin-barbers__card-content">
              <h3 className="admin-barbers__card-name">
                {barber.first_name} {barber.last_name}
              </h3>
              <p className="admin-barbers__card-specialty">{barber.specialty || 'No specialty'}</p>

              <div className="admin-barbers__card-actions">
                <button className="admin-barbers__card-edit" onClick={() => handleEdit(barber)}>
                  Edit
                </button>
                <button
                  className="admin-barbers__card-delete"
                  onClick={() => handleDelete(barber)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {showForm && (
        <BarberForm
          barber={editingBarber}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </section>
  );
};

export default AdminBarbers;
