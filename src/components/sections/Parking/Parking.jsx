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
          <div className="parking__map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2880.23537268971!2d-79.4207658224467!3d43.788728771096075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2d31ed9d7a07%3A0xcba686a6d324ddfa!2sOutkasts%20Barbershop!5e0!3m2!1sen!2sca!4v1771675423528!5m2!1sen!2sca"
              className="parking__map"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Parking;
