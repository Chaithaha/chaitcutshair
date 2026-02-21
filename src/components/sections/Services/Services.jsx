/**
 * Services Component
 *
 * The services section showing available grooming options:
 * - Section title "Our Services"
 * - Three service cards in a grid
 * - Each card has number, title, description, price, and link
 * - Hover effect changes card to black with white text
 *
 * @returns {JSX.Element} The services section
 */

import './Services.css';

const Services = () => {
  /* Service data - add or remove services here */
  const services = [
    {
      number: '01',
      title: 'Haircuts',
      description: 'Precision fades, classic tapers, and modern scissor cuts performed by master barbers in an upscale environment.',
      price: '$45'
    },
    {
      number: '02',
      title: 'Beard Trims',
      description: 'Sculpting, lining, and conditioning to keep your facial hair looking sharp, healthy, and perfectly groomed.',
      price: '$30'
    },
    {
      number: '03',
      title: 'Luxury Shaves',
      description: 'Traditional hot towel treatment with straight-razor precision for the smoothest, most refined finish possible.',
      price: '$55'
    }
  ];

  return (
    <section className="services" id="services">
      <div className="services__container">
        <div className="services__header">
          <h2 className="services__title">Our Services</h2>
        </div>
        <div className="services__grid">
          {services.map((service, index) => (
            <div key={index} className="services__card">
              <div className="services__card-content">
                <span className="services__number">{service.number}</span>
                <h3 className="services__card-title">{service.title}</h3>
                <p className="services__card-description">{service.description}</p>
              </div>
              <div className="services__card-footer">
                <span className="services__price">{service.price}</span>
                <a href="#" className="services__card-link">Book Now</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
