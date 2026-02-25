/**
 * BarbersPage Component
 *
 * Team showcase with editorial portrait layout:
 * - Asymmetric staggered grid
 * - Hover state with specialty highlight
 * - Placeholder avatars with elegant fallback
 *
 * @returns {JSX.Element} The barbers page
 */

import { useState, useEffect } from 'react';
import { getBarbers } from '../../../lib/supabaseClient';
import './BarbersPage.css';

const BarberCard = ({ barber, index, onBook }) => {
  const barberName = `${barber.first_name} ${barber.last_name}`;

  return (
    <article className="barbers-page__card">
      {/* Image/Placeholder */}
      <div className="barbers-page__card-image">
        {barber.profile_img ? (
          <img src={barber.profile_img} alt={barberName} />
        ) : (
          <div className="barbers-page__card-placeholder">
            <div className="barbers-page__card-placeholder-inner">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </div>
            <div className="barbers-page__card-placeholder-pattern"></div>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="barbers-page__card-overlay">
          <span className="barbers-page__card-experience">{barber.specialty}</span>
        </div>
      </div>

      {/* Content */}
      <div className="barbers-page__card-content">
        <div className="barbers-page__card-header">
          <h3 className="barbers-page__card-name">{barberName}</h3>
          <div className="barbers-page__card-line"></div>
        </div>
        <p className="barbers-page__card-specialty">{barber.specialty}</p>
        <p className="barbers-page__card-bio">{barber.bio}</p>
        <button className="barbers-page__card-cta" onClick={() => onBook?.(barber)}>
          <span>Book with {barber.first_name}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Decorative number */}
      <span className="barbers-page__card-number">0{index + 1}</span>
    </article>
  );
};

const BarbersPage = ({ onBookBarber }) => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const data = await getBarbers();
        console.log('Barbers data:', data);
        setBarbers(data);
      } catch (err) {
        setError('Failed to load barbers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  return (
    <section className="barbers-page" id="barbers">
      {/* Grain Texture */}
      <div className="barbers-page__grain"></div>

      {/* Background Decorative Element */}
      <div className="barbers-page__bg-text">MASTERS</div>

      <div className="barbers-page__container">
        {/* Header */}
        <header className="barbers-page__header">
          <div className="barbers-page__header-accent">
            <div className="barbers-page__header-accent-line"></div>
            <span>The Team</span>
          </div>
          <h1 className="barbers-page__title">
            Meet Our <br />
            <span className="barbers-page__title-highlight">Master Barbers</span>
          </h1>
          <p className="barbers-page__subtitle">
            Each barber at ChaitCutsHair is hand-selected for their exceptional skill,
            creativity, and dedication to the craft of grooming.
          </p>
        </header>

        {/* Barbers Grid */}
        <div className="barbers-page__grid">
          {loading ? (
            <p className="barbers-page__loading">Loading barbers...</p>
          ) : error ? (
            <p className="barbers-page__error">{error}</p>
          ) : (
            barbers.map((barber, index) => (
              <BarberCard key={barber.id} barber={barber} index={index} onBook={onBookBarber} />
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default BarbersPage;
