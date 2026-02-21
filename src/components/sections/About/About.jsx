/**
 * About Component
 *
 * Editorial brutalist about section with:
 * - Oversized typography as visual anchor
 * - Clean image layout with border accent
 * - Animated stats with pulse effect
 * - Grain texture overlay for depth
 *
 * @returns {JSX.Element} The about section
 */

import { useState, useEffect, useRef } from 'react';
import './About.css';

/* Animated stat component with countdown and pulse */
const AnimatedStat = ({ target, suffix, label }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const statRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );

    if (statRef.current) {
      observer.observe(statRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 800;
    const steps = 40;
    const stepDuration = duration / steps;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        setIsComplete(true);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <div className={`about__stat ${isComplete ? 'about__stat--complete' : ''}`} ref={statRef}>
      <div className="about__stat-value">
        <span className="about__stat-number">{count}</span>
        <span className="about__stat-suffix">{suffix}</span>
      </div>
      <div className="about__stat-label">{label}</div>
    </div>
  );
};

const About = () => {
  return (
    <section className="about" id="about">
      <div className="about__grain"></div>
      <div className="about__container">
        {/* Massive decorative number */}
        <div className="about__bg-number">01</div>

        <div className="about__grid">
          {/* Left column - Image */}
          <div className="about__image-col">
            <div className="about__image-wrapper">
              <img
                src="/Screenshot 2026-02-21 061359.png"
                alt="Barber at work"
                className="about__img"
              />
            </div>
          </div>

          {/* Right column - Content */}
          <div className="about__content-col">
            {/* Badge */}
            <div className="about__badge-row">
              <span className="about__badge">Est. 2026</span>
              <div className="about__badge-line"></div>
            </div>

            {/* Title with emphasis */}
            <h2 className="about__title">
              <span className="about__title-line">Crafting</span>
              <span className="about__title-line about__title-line--accent">Confidence</span>
              <span className="about__title-line">through Precision</span>
            </h2>

            {/* Description with accent line */}
            <div className="about__description-wrapper">
              <div className="about__accent-line"></div>
              <p className="about__description">
                We believe that a great haircut is more than just a service—it's an experience. Our shop combines the heritage of traditional barbering with the convenience of modern technology.
              </p>
              <p className="about__description about__description--secondary">
                Every barber at ChaitCutsHair is hand-selected for their skill, professionalism, and dedication to the craft. We use only premium products to ensure you leave looking and feeling your best.
              </p>
            </div>

            {/* Stats */}
            <div className="about__stats">
              <AnimatedStat target={10} suffix="+" label="Expert Barbers" />
              <div className="about__stats-divider"></div>
              <AnimatedStat target={5} suffix="k+" label="Happy Clients" />
            </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="about__bottom-line"></div>
      </div>
    </section>
  );
};

export default About;
