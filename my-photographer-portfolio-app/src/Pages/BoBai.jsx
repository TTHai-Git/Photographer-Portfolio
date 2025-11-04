import React from 'react';
import "../Assets/CSS/BoBai.css";
import { importAllImagesByDir } from '../utils/index';

export const BoBai = () => {
  const images = importAllImagesByDir(
    require.context(
      '../Assets/Images/showcase/deep-connection-vsersion-2/',
      false,
      /\.(png|jpe?g|svg)$/ // load all images
    )
  );

  return (
    <div className="BoBai-container">
      <h1 className="BoBai-title">DEEP CONNECTION VERSION 2</h1>

      {/* --- Top 6 Images: 3 per row --- */}
      <div className="BoBai-showcase-top">
        {Object.keys(images)
          .slice(0, 6)
          .map((key) => (
            <div className="BoBai-item-top" key={key}>
              <img
                src={images[key]}
                alt={key}
                className="BoBai-image-top"
              />
            </div>
          ))}
      </div>

      {/* --- Bottom Images: Each centered --- */}
      <div className="BoBai-showcase-bottom">
        {Object.keys(images)
          .slice(6)
          .map((key) => (
            <div className="BoBai-item-bottom" key={key}>
              <img
                src={images[key]}
                alt={key}
                className="BoBai-image-bottom"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default BoBai;
