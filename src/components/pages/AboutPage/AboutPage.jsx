/**
 * AboutPage Component
 *
 * A dedicated page for the About section content.
 * Reuses the About section component.
 *
 * @returns {JSX.Element} The about page
 */

import About from '../../sections/About/About';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <About />
    </div>
  );
};

export default AboutPage;
