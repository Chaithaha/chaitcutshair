/**
 * Navigation Component
 *
 * The main navigation bar that stays at the top of the page:
 * - Logo on the left side
 * - Navigation links in the center (hidden on mobile)
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
        <a href="#" className="navigation__link">Home</a>
      </li>
      <li className="navigation__item">
        <a href="#services-page" className="navigation__link">Services</a>
      </li>
      <li className="navigation__item">
        <a href="#barbers" className="navigation__link">Barbers</a>
      </li>
      <li className="navigation__item">
        <a href="#about" className="navigation__link">About</a>
      </li>
    </ul>
  );

  return (
    <nav className="navigation">
      <div className="navigation__container">
        {logo}
        {links}
      </div>
    </nav>
  );
};

export default Navigation;
