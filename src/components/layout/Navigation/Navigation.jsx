/**
 * Navigation Component
 *
 * The main navigation bar that stays at the top of the page:
 * - Logo on the left side
 * - Navigation links in the center (hidden on mobile)
 * - "Book Now" button on the right
 * - Sticks to the top when you scroll
 *
 * @returns {JSX.Element} The navigation bar
 */

import './Navigation.css';

const Navigation = () => {
  // The logo image that links back to home
  const logo = (
    <img src="/logo.png" alt="CHAITcutsHair" className="navigation__logo" />
  );

  // List of navigation links to different sections
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

  // Call-to-action button to book an appointment
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
