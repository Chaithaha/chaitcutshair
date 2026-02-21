/**
 * App Component
 *
 * The main application component that sets up the page structure:
 * - Navigation bar at the top
 * - More sections can be added here as the site grows
 *
 * @returns {JSX.Element} The main app structure
 */

import Navigation from './components/layout/Navigation/Navigation';
import Hero from './components/sections/Hero/Hero';
import About from './components/sections/About/About';
import Services from './components/sections/Services/Services';
import Parking from './components/sections/Parking/Parking';
import Reviews from './components/sections/Reviews/Reviews';

function App() {
  return (
    <>
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Parking />
      <Reviews />
    </>
  );
}

export default App;
