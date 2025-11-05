import { useState } from "react";
import "../Assets/CSS/Cocktail.css";
import { importAllImagesByDir } from "../utils/index";
import LightBox from "../utils/LightBox";

const Cocktail = () => {
  const images = importAllImagesByDir(
    require.context(
      "../Assets/Images/showcase/verdant-cocktail-bar/",
      false,
      /\.(png|jpe?g|svg)$/
    )
  );

  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const handleImageClick = (index) => {
    const slideList = Object.keys(images).map((key) => ({
      src: images[key],
      title: key
        .replace(/\.(png|jpe?g|svg)$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
    setSlides(slideList);
    setStartIndex(index);
    setIsOpen(true);
  };


  return (
    <div className="Cocktail-container">
      <h1 className="Cocktail-title">VERDANT COCKTAIL BAR</h1>

      {/* --- Top 8 Images (2 rows × 4 columns) --- */}
      <div className="Cocktail-showcase-top">
        {Object.keys(images)
          .slice(0, 8)
          .map((key, index) => (
            <div className="Cocktail-item-top" key={key}>
              <img
                src={images[key]}
                alt={key}
                className="Cocktail-image-top fade-in"
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
      </div>

      {/* --- Content Section --- */}
      <h2 className="Cocktail-content">
        content
      </h2>

      {/* --- Bottom 2 Images (each centered) --- */}
      <div className="Cocktail-showcase-bottom">
        {Object.keys(images)
          .slice(8)
          .map((key, index) => (
            <div className="Cocktail-item-bottom" key={key}>
              <img
                src={images[key]}
                alt={key}
                className="Cocktail-image-bottom fade-in"
                onClick={() => handleImageClick(index + 8)}
              />
            </div>
          ))}
      </div>
      {/* --- Lightbox Modal --- */}
      {isOpen && (
        <LightBox
          isOpen={isOpen}
          slides={slides}
          startIndex={startIndex}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Cocktail;
