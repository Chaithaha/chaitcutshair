/**
 * Navigation Component
 *
 * The main navigation bar that stays at the top of the page:
 * - Logo on the left side
 * - Navigation links in the center (hidden on mobile)
 * - Burger menu on mobile
 * - Sticks to the top when you scroll
 *
 * @returns {JSX.Element} The navigation bar
 */

import { useState } from 'react';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // The logo image that links back to home
  const logo = (
    <a href="/" onClick={closeMenu}>
      <img src="/logo.png" alt="CHAITcutsHair" className="navigation__logo" />
    </a>
  );

  // List of navigation links to different sections
  const links = (
    <ul className={`navigation__links ${isMenuOpen ? 'navigation__links--open' : ''}`}>
      <li className="navigation__item">
        <a href="/" className="navigation__link" onClick={closeMenu}>Home</a>
      </li>
      <li className="navigation__item">
        <a href="/#services-page" className="navigation__link" onClick={closeMenu}>Services</a>
      </li>
      <li className="navigation__item">
        <a href="/barbers" className="navigation__link" onClick={closeMenu}>Barbers</a>
      </li>
      <li className="navigation__item">
        <a href="/about" className="navigation__link" onClick={closeMenu}>About</a>
      </li>
    </ul>
  );

  // Burger menu button
  const burgerMenu = (
    <button
      className={`navigation__burger ${isMenuOpen ? 'navigation__burger--open' : ''}`}
      onClick={toggleMenu}
      aria-label="Toggle menu"
    >
      <span className="navigation__burger-line"></span>
      <span className="navigation__burger-line"></span>
      <span className="navigation__burger-line"></span>
    </button>
  );

  return (
    <nav className="navigation">
      <div className="navigation__container">
        {logo}
        {links}
        {burgerMenu}
      </div>
      {isMenuOpen && <div className="navigation__overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navigation;
