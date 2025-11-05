// BoBai.jsx
import React, { useState } from "react";
import "../Assets/CSS/BoBai.css";
import { importAllImagesByDir } from "../utils/index";
import LightBox from "../utils/LightBox";

export const BoBai = () => {
  const images = importAllImagesByDir(
    require.context(
      "../Assets/Images/showcase/deep-connection-vsersion-2/",
      false,
      /\.(png|jpe?g|svg)$/ // load all images
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
    <div className="BoBai-container">
      <h1 className="BoBai-title">DEEP CONNECTION VERSION 2</h1>

      {/* --- Top 6 Images: 3 per row --- */}
      <div className="BoBai-showcase-top">
        {Object.keys(images)
          .slice(0, 6)
          .map((key, index) => (
            <div className="BoBai-item-top" key={key}>
              <img
                src={images[key]}
                alt={key}
                className="BoBai-image-top fade-in"
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
      </div>

      {/* --- Bottom Images --- */}
      <div className="BoBai-showcase-bottom">
        {Object.keys(images)
          .slice(6)
          .map((key, index) => (
            <div className="BoBai-item-bottom" key={key}>
              <img
                src={images[key]}
                alt={key}
                className="BoBai-image-bottom fade-in"
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
};

export default BoBai;
