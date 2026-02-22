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
import './ServicesPage.css';

const DUMMY_SERVICES = [
  {
    id: '1',
    number: '01',
    name: 'Precision Haircut',
    description: 'Expert fades, classic tapers, and contemporary scissor work. Every cut is tailored to your face shape, lifestyle, and personal aesthetic.',
    duration: '45 min',
    price: 35,
  },
  {
    id: '2',
    number: '02',
    name: 'Beard Sculpting',
    description: 'Full beard grooming including shaping, lining, hot towel treatment, and premium beard oil application for a polished finish.',
    duration: '30 min',
    price: 15,
  },
  {
    id: '3',
    number: '03',
    name: 'The Full Package',
    description: 'Our signature combination: precision haircut plus beard sculpting with enhanced hot towel service and scalp massage.',
    duration: '75 min',
    price: 45,
  },
  {
    id: '4',
    number: '04',
    name: 'Junior Cut',
    description: 'Gentle, patient service for young gentlemen under 12. A positive first barbershop experience that builds confidence.',
    duration: '30 min',
    price: 25,
  },
  {
    id: '5',
    number: '05',
    name: 'Custom Design',
    description: 'Express yourself with precision hair artistry. From subtle patterns to bold statements, our specialists bring your vision to life.',
    duration: '60 min',
    price: 20,
  },
];

const ServiceCard = ({ service, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

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
      className={`services-page__card ${isVisible ? 'services-page__card--visible' : ''} ${isHovered ? 'services-page__card--hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Number */}
      <span className="services-page__card-bg-number">{service.number}</span>

      {/* Diagonal Accent */}
      <div className="services-page__card-accent"></div>

      {/* Content */}
      <div className="services-page__card-inner">
        <header className="services-page__card-header">
          <span className="services-page__card-number">{service.number}</span>
          <div className="services-page__card-duration">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{service.duration}</span>
          </div>
        </header>

        <h3 className="services-page__card-title">{service.name}</h3>
        <p className="services-page__card-description">{service.description}</p>

        <footer className="services-page__card-footer">
          <div className="services-page__card-price">
            <span className="services-page__card-price-currency">$</span>
            <span className="services-page__card-price-value">{service.price}</span>
          </div>
          <button className="services-page__card-cta">
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

const ServicesPage = () => {
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
          {DUMMY_SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="services-page__footer">
          <div className="services-page__footer-line"></div>
          <p className="services-page__footer-text">
            Not sure what you need? <a href="#contact">Contact us</a> for a free consultation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
