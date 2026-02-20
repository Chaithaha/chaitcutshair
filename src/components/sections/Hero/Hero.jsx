/**
 * Hero Component
 *
 * The main hero section at the top of the page:
 * - Full-width background image that moves on scroll (parallax)
 * - Dark gradient so text is easy to read
 * - Description text below the headline
 * - "Book Your Appointment" button
 * - Small line that grows when the page loads
 * - Elements fade in one after another
 *
 * @returns {JSX.Element} The hero section
 */

import './Hero.css';
import { useEffect, useRef, useState } from 'react';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transformStyle = {
    transform: `translateY(${scrollY * 0.5}px) scale(1.1)`,
  };

  return (
    <section className="hero" aria-label="Welcome to CHAITcutsHair" ref={heroRef}>
      {/* Background Layer */}
      <div className="hero__background">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=85"
          alt=""
          className="hero__image"
          style={transformStyle}
        />
        <div className="hero__overlay" aria-hidden="true"></div>
      </div>

      {/* Content Layer */}
      <div className="hero__content">
        {/* Accent Line */}
        <div className="hero__accent-line" aria-hidden="true"></div>

        {/* Subheadline */}
        <p className="hero__subheadline">
          Where tradition meets modern precision. Experience the art of grooming.
        </p>

        {/* CTA Button */}
        <a href="#booking" className="hero__cta">
          Book Your Appointment
        </a>
      </div>
    </section>
  );
};

export default Hero;
