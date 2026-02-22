/**
 * App Component
 *
 * The main application component that sets up the page structure:
 * - Navigation bar at the top
 * - Hero, About, Services, Barbers sections
 * - Floating booking button
 *
 * @returns {JSX.Element} The main app structure
 */

import Navigation from './components/layout/Navigation/Navigation';
import Hero from './components/sections/Hero/Hero';
import About from './components/sections/About/About';
import ServicesPage from './components/pages/ServicesPage/ServicesPage';
import BarbersPage from './components/pages/BarbersPage/BarbersPage';
import Parking from './components/sections/Parking/Parking';
import Reviews from './components/sections/Reviews/Reviews';
import BookingButton from './components/ui/BookingButton/BookingButton';

function App() {
  return (
    <>
      <Navigation />
      <Hero />
      <About />
      <ServicesPage />
      <BarbersPage />
      <Parking />
      <Reviews />
      <BookingButton />
    </>
  );
}

export default App;
