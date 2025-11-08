import  { useState } from 'react'
import "../Assets/CSS/FruitMarco.css";
import LightBox from "../utils/LightBox";
import { useCloudinaryImages } from '../hooks/loadImagesOnCloudinary';
export const FruitMacro = () => {
    const { images, loading, count } = useCloudinaryImages("Hoang-Truc-Photographer-Portfolio/showcase/fruit-macro");
  
    const [isOpen, setIsOpen] = useState(false);
    const [slides, setSlides] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
  
    const handleImageClick = (index) => {
      const slideList = images.map((image) => ({
        src: image.url,
        title: image.file_name
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
          {images
            .slice(0, 6)
            .map((image, index) => (
              <div className="FruitMacro-item-top" key={image.asset_id}>
                <img
                  src={image.url}
                  alt={image.file_name}
                  className="FruitMacro-image-top fade-in"
                  onClick={() => handleImageClick(index)}
                />
              </div>
            ))}
        </div>
  
        {/* --- Bottom Images --- */}
        <div className="FruitMacro-showcase-bottom">
          {images
            .slice(6)
            .map((image, index) => (
              <div className="FruitMacro-item-bottom" key={image.asset_id}>
                <img
                  src={image.url}
                  alt={image.file_name}
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