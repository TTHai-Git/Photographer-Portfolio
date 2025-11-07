// ShowCase.jsx
import { useEffect, useState } from "react";
import "../Assets/CSS/ShowCase.css";
import LightBox from "../utils/LightBox";
import { loadImagesByDir } from "../hooks/loadImagesData";
import { NavLink } from "react-router-dom";

export const ShowCase = () => {
  const[images, setImages] = useState({})
  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const handleImageClick = (index) => {
    const slideList = Object.keys(images).map((key) => ({
      src: images[key],
      title: key
        .replace(/\.(png|jpe?g|svg|webp)$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
    setSlides(slideList);
    setStartIndex(index);
    setIsOpen(true);
  };

  useEffect(() => {
    setImages(loadImagesByDir(require.context("../Assets/Images/showcase/webp/", false, /\.(png|jpe?g|svg|webp)$/)))
  }, [])

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
        {Object.keys(images).map((key, index) => (
          <div key={key} className="showcase-item fade-in">
            <p className="showcase-caption">{key}</p>
            <img
              src={images[key]}
              alt={key}
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
