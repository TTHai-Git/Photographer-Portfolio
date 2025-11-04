import React from 'react';
import "../Assets/CSS/NguyenSac.css";
import { importAllImagesByDir } from '../utils/index';

const NguyenSac = () => {
  const images = importAllImagesByDir(
    require.context(
      '../Assets/Images/showcase/nguyen-sac/',
      false,
      /\.(png|jpe?g|svg)$/
    )
  );

  return (
    <div className="NguyenSac-container">
      <h1 className="NguyenSac-title">NGUYÊN SẮC</h1>

      {/* --- Top 3 Images (1 row × 3 columns) --- */}
      <div className="NguyenSac-showcase-top">
        {Object.keys(images)
          .slice(0, 3)
          .map((key) => (
            <div className="NguyenSac-item-top" key={key}>
              <img
                src={images[key]}
                alt={key}
                className="NguyenSac-image-top"
              />
            </div>
          ))}
      </div>

      {/* --- Bottom Images (each centered) --- */}
      <div className="NguyenSac-showcase-bottom">
        {Object.keys(images)
          .slice(3)
          .map((key) => (
            <div className="NguyenSac-item-bottom" key={key}>
              <img
                src={images[key]}
                alt={key}
                className="NguyenSac-image-bottom"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default NguyenSac;
