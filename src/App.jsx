/**
 * App Component
 *
 * The main application component that sets up the page structure:
 * - Navigation bar at the top
 * - Hero, About, Services, Barbers sections
 * - Floating booking button
 * - Admin dashboard (protected route)
 *
 * @returns {JSX.Element} The main app structure
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/layout/Navigation/Navigation';
import Hero from './components/sections/Hero/Hero';
import About from './components/sections/About/About';
import ServicesPage from './components/pages/ServicesPage/ServicesPage';
import BarbersPage from './components/pages/BarbersPage/BarbersPage';
import Parking from './components/sections/Parking/Parking';
import Reviews from './components/sections/Reviews/Reviews';
import BookingButton from './components/ui/BookingButton/BookingButton';
import AdminLogin from './components/admin/AdminLogin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard/AdminDashboard';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preselectedBarber, setPreselectedBarber] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPreselectedBarber(null);
  };

  const handleBookBarber = (barber) => {
    setPreselectedBarber(barber);
    setIsModalOpen(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Main site routes */}
        <Route path="/" element={
          <>
            <Navigation />
            <Hero onOpenModal={handleOpenModal} />
            <About />
            <ServicesPage />
            <BarbersPage onBookBarber={handleBookBarber} />
            <Parking />
            <Reviews />
            <BookingButton
              isOpen={isModalOpen}
              onOpen={handleOpenModal}
              onClose={handleCloseModal}
              preselectedBarber={preselectedBarber}
            />
          </>
        } />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
