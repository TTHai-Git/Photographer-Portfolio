// ShowCase.jsx
import {useState } from "react";
import "../Assets/CSS/ShowCase.css";
import LightBox from "../utils/LightBox";
import { NavLink } from "react-router-dom";
import { useCloudinaryImages } from "../hooks/loadImagesOnCloudinary";

export const ShowCase = () => {
  const { images, loading, count } = useCloudinaryImages("Hoang-Truc-Photographer-Portfolio/showcase");
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
    <div className="showcase-container">
      <h1 className="showcase-title">Showcase</h1>

      {/* --- Navigation Bar --- */}
      <nav>
        <ul className="showcase-nav">
          <li>
            <NavLink 
              to="/show-case/cocktail"
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>Cocktail</span>
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/show-case/nguyen-sac"
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>Nguyen Sac</span>
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/show-case/bo-bai"
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>Bo Bai</span>
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/show-case/fruit-macro"
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>Fruit Macro</span>
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/show-case/kinh-boi"
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>Kinh Boi</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* --- Each Image (full width) --- */}
      <div className="showcase-list">
        {images.map((image, index) => (
          <div key={image.asset_id} className="showcase-item fade-in">
            <p className="showcase-caption">{image.file_name}</p>
            <img
              src={image.url}
              alt={image.file_name}
              className="showcase-image"
              onClick={() => handleImageClick(index)}
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

export default ShowCase;
