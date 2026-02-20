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

function App() {
  return (
    <>
      <Navigation />
      <Hero />
    </>
  );
}

export default App;
