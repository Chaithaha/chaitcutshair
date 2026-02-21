/**
 * Parking Component
 *
 * Information about parking availability:
 * - Clean, minimal layout
 * - Parking details
 * - Location information
 *
 * @returns {JSX.Element} The parking section
 */

import './Parking.css';

const Parking = () => {
  return (
    <section className="parking" id="parking">
      <div className="parking__container">
        <div className="parking__content">
          <h2 className="parking__title">Parking</h2>
          <div className="parking__divider"></div>
          <div className="parking__info">
            <p className="parking__text">
              Free parking available for all customers.
            </p>
            <p className="parking__text parking__text--secondary">
              Located directly behind our shop with dedicated entrance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Parking;
