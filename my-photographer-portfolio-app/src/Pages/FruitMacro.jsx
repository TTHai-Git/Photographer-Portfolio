import React, { useState } from 'react'
import "../Assets/CSS/FruitMarco.css";
import { importAllImagesByDir } from "../utils/index";
import LightBox from "../utils/LightBox";
export const FruitMacro = () => {
  const images = importAllImagesByDir(
      require.context(
        "../Assets/Images/showcase/fruit-macro/webp",
        false,
        /\.(png|jpe?g|svg|webp)$/ // load all images
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
      <div className="FruitMacro-container">
        <h1 className="FruitMacro-title">FRUIT MACRO CONNECTION</h1>
  
        {/* --- Top 6 Images: 3 per row --- */}
        <div className="FruitMacro-showcase-top">
          {Object.keys(images)
            .slice(0, 6)
            .map((key, index) => (
              <div className="FruitMacro-item-top" key={key}>
                <img
                  src={images[key]}
                  alt={key}
                  className="FruitMacro-image-top fade-in"
                  onClick={() => handleImageClick(index)}
                />
              </div>
            ))}
        </div>
  
        {/* --- Bottom Images --- */}
        <div className="FruitMacro-showcase-bottom">
          {Object.keys(images)
            .slice(6)
            .map((key, index) => (
              <div className="FruitMacro-item-bottom" key={key}>
                <img
                  src={images[key]}
                  alt={key}
                  className="FruitMacro-image-bottom fade-in"
                  onClick={() => handleImageClick(index + 6)}
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
}
export default FruitMacro