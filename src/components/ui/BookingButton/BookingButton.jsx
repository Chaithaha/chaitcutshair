/**
 * BookingButton Component
 *
 * A floating action button at the bottom right of the screen
 * that opens the booking modal when clicked.
 *
 * @returns {JSX.Element} The floating booking button
 */

import { useState } from 'react';
import BookingModal from '../BookingModal/BookingModal';
import './BookingButton.css';

const BookingButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className="booking-button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Open booking modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="booking-button__text">Book Now</span>
      </button>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default BookingButton;
