/**
 * BarbersPage Component
 *
 * Team showcase with editorial portrait layout:
 * - Asymmetric staggered grid
 * - Reveal animations on scroll
 * - Hover state with specialty highlight
 * - Placeholder avatars with elegant fallback
 *
 * @returns {JSX.Element} The barbers page
 */

import { useState, useEffect, useRef } from 'react';
import './BarbersPage.css';

const DUMMY_BARBERS = [
  {
    id: '1',
    name: 'Marcus Johnson',
    specialty: 'Fades & Beard Specialist',
    bio: '10+ years crafting perfect fades. Marcus believes every client deserves a cut that turns heads.',
    experience: '10 years',
    image: null,
  },
  {
    id: '2',
    name: 'David Chen',
    specialty: 'Classic Cuts & Styling',
    bio: 'Trained in traditional barbering techniques with a modern edge. David specializes in timeless looks.',
    experience: '7 years',
    image: null,
  },
  {
    id: '3',
    name: 'Trey Williams',
    specialty: 'Designs & Creative Cuts',
    bio: 'The creative force behind our most intricate designs. Trey transforms hair into art.',
    experience: '5 years',
    image: null,
  },
];

const BarberCard = ({ barber, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), index * 150);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <article
      ref={cardRef}
      className={`barbers-page__card ${isVisible ? 'barbers-page__card--visible' : ''} ${isHovered ? 'barbers-page__card--hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image/Placeholder */}
      <div className="barbers-page__card-image">
        {barber.image ? (
          <img src={barber.image} alt={barber.name} />
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
          <span className="barbers-page__card-experience">{barber.experience} experience</span>
        </div>
      </div>

      {/* Content */}
      <div className="barbers-page__card-content">
        <div className="barbers-page__card-header">
          <h3 className="barbers-page__card-name">{barber.name}</h3>
          <div className="barbers-page__card-line"></div>
        </div>
        <p className="barbers-page__card-specialty">{barber.specialty}</p>
        <p className="barbers-page__card-bio">{barber.bio}</p>
        <button className="barbers-page__card-cta">
          <span>Book with {barber.name.split(' ')[0]}</span>
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

const BarbersPage = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="barbers-page" id="barbers">
      {/* Grain Texture */}
      <div className="barbers-page__grain"></div>

      {/* Background Decorative Element */}
      <div className="barbers-page__bg-text">MASTERS</div>

      <div className="barbers-page__container">
        {/* Header */}
        <header ref={headerRef} className={`barbers-page__header ${headerVisible ? 'barbers-page__header--visible' : ''}`}>
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
          {DUMMY_BARBERS.map((barber, index) => (
            <BarberCard key={barber.id} barber={barber} index={index} />
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="barbers-page__join">
          <div className="barbers-page__join-content">
            <span className="barbers-page__join-badge">We're Hiring</span>
            <h3 className="barbers-page__join-title">Join Our Team</h3>
            <p className="barbers-page__join-text">
              Are you a talented barber looking for a new home? We're always looking for passionate professionals.
            </p>
            <a href="#contact" className="barbers-page__join-cta">Get in Touch</a>
          </div>
          <div className="barbers-page__join-graphic">
            <div className="barbers-page__join-circle"></div>
            <div className="barbers-page__join-circle barbers-page__join-circle--2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BarbersPage;
