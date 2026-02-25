/**
 * ServicesPage Component
 *
 * Full-page services view with editorial design:
 * - Dramatic oversized numerals as visual anchors
 * - Hover-reveal pricing with smooth transitions
 * - Diagonal accent lines for visual movement
 * - Grain texture overlay for depth
 *
 * @returns {JSX.Element} The services page
 */

import { useState, useEffect, useRef } from 'react';
import { getServices } from '../../../lib/supabaseClient';
import './ServicesPage.css';

const ServiceCard = ({ service, index, onBook }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  const serviceNumber = String(index + 1).padStart(2, '0');
  const durationDisplay = service.duration >= 60
    ? `${Math.floor(service.duration / 60)}h ${service.duration % 60}m`
    : `${service.duration} min`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), index * 100);
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
      className={`services-page__card ${isVisible ? 'services-page__card--visible' : ''}`}
    >
      {/* Service Image */}
      {service.service_img && (
        <div className="services-page__card-image">
          <img src={service.service_img} alt={service.name} />
        </div>
      )}

      {/* Background Number */}
      <span className="services-page__card-bg-number">{serviceNumber}</span>

      {/* Diagonal Accent */}
      <div className="services-page__card-accent"></div>

      {/* Content */}
      <div className="services-page__card-inner">
        <header className="services-page__card-header">
          <span className="services-page__card-number">{serviceNumber}</span>
          <div className="services-page__card-duration">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{durationDisplay}</span>
          </div>
        </header>

        <h3 className="services-page__card-title">{service.name}</h3>
        <p className="services-page__card-description">{service.description || 'Professional grooming service tailored to your style.'}</p>

        <footer className="services-page__card-footer">
          <div className="services-page__card-price">
            <span className="services-page__card-price-currency">$</span>
            <span className="services-page__card-price-value">{service.price}</span>
          </div>
          <button className="services-page__card-cta" onClick={() => onBook?.(service)}>
            <span>Book Now</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </footer>
      </div>

      {/* Hover Border Animation */}
      <div className="services-page__card-border"></div>
    </article>
  );
};

const ServicesPage = ({ onBookService }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError('Failed to load services');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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
    <section className="services-page" id="services-page">
      {/* Grain Texture */}
      <div className="services-page__grain"></div>

      {/* Decorative Elements */}
      <div className="services-page__decor">
        <div className="services-page__decor-line services-page__decor-line--1"></div>
        <div className="services-page__decor-line services-page__decor-line--2"></div>
        <div className="services-page__decor-circle"></div>
      </div>

      <div className="services-page__container">
        {/* Header */}
        <header ref={headerRef} className={`services-page__header ${headerVisible ? 'services-page__header--visible' : ''}`}>
          <div className="services-page__header-badge">
            <span className="services-page__header-badge-dot"></span>
            <span>Our Menu</span>
          </div>
          <h1 className="services-page__title">
            <span className="services-page__title-line">Premium</span>
            <span className="services-page__title-line services-page__title-line--outline">Grooming</span>
            <span className="services-page__title-line">Services</span>
          </h1>
          <p className="services-page__subtitle">
            Every service is delivered with precision, care, and the finest products.
            No shortcuts—just exceptional results.
          </p>
        </header>

        {/* Services Grid */}
        <div className="services-page__grid">
          {loading ? (
            <p className="services-page__loading">Loading services...</p>
          ) : error ? (
            <p className="services-page__error">{error}</p>
          ) : (
            services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} onBook={onBookService} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
