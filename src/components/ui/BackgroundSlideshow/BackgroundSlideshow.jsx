/**
 * BackgroundSlideshow Component
 *
 * A slideshow background with dark overlay:
 * - Cycles through images automatically
 * - Crossfade animation between images
 * - Dark overlay on top of images
 *
 * @param {Array} images - List of image paths to display
 * @returns {JSX.Element} The slideshow background
 */

import './BackgroundSlideshow.css';

const BackgroundSlideshow = ({ images = [] }) => {
  return (
    <div className="background-slideshow">
      {images.map((image, index) => (
        <div
          key={index}
          className={`background-slideshow__slide background-slideshow__slide--${index + 1}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      <div className="background-slideshow__overlay" />
    </div>
  );
};

export default BackgroundSlideshow;
