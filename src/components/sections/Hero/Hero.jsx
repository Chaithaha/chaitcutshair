/**
 * Hero Component
 *
 * The main hero section at the top of the page:
 * - Slideshow background with dark overlay
 * - Bold headline
 * - Subheadline text below
 * - CTA button to book appointments
 *
 * @param {Object} props
 * @param {Function} props.onOpenModal - Callback to open the booking modal
 * @returns {JSX.Element} The hero section
 */

import './Hero.css';
import BackgroundSlideshow from '../../ui/BackgroundSlideshow/BackgroundSlideshow';

const Hero = ({ onOpenModal }) => {
  /* Add or remove image paths here to customize the slideshow */
  const heroImages = [
    'test1.jpeg',
    '/test2.png',
    '/test3.png',
  ];

  return (
    <section className="hero">
      <BackgroundSlideshow images={heroImages} />
      <div className="hero__container">
        <h1 className="hero__headline">
          Chait<span className="hero__headline-light">Cuts</span><span className="hero__headline-bold">Hair</span>
        </h1>
        <p className="hero__subheadline">
          Premium grooming services tailored for the modern gentleman.
          Book your next appointment in seconds.
        </p>
        <button className="hero__cta" onClick={onOpenModal}>Schedule Appointment</button>
      </div>
    </section>
  );
};

export default Hero;
