/**
 * Navigation Component
 * Main site navigation bar with logo, links, and CTA button
 */

import './Navigation.css';

const Navigation = () => {
  // Logo
  const logo = (
    <img src="/logo.png" alt="CHAITcutsHair" className="navigation__logo" />
  );

  // Nav Links
  const links = (
    <ul className="navigation__links">
      <li className="navigation__item">
        <a href="#services" className="navigation__link">Services</a>
      </li>
      <li className="navigation__item">
        <a href="#barbers" className="navigation__link">Barbers</a>
      </li>
      <li className="navigation__item">
        <a href="#about" className="navigation__link">About</a>
      </li>
      <li className="navigation__item">
        <a href="#contact" className="navigation__link">Contact</a>
      </li>
    </ul>
  );

  // CTA Button
  const ctaButton = (
    <a href="#" className="navigation__cta">Book Now</a>
  );

  return (
    <nav className="navigation">
      <div className="navigation__container">
        {logo}
        {links}
        {ctaButton}
      </div>
    </nav>
  );
};

export default Navigation;
