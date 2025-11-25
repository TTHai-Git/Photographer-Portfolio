// ShowCase.jsx
import {useEffect, useState } from "react";
import "../Assets/CSS/ShowCase.css";
import LightBox from "../utils/LightBox";
import { useCloudinaryImages } from "../hooks/loadImagesOnCloudinary";
import { scrollToElement } from "../Helpers/ScrollToElement";
import { mainPhotoList } from "../Data/mainPhotoList";
import ShowCaseItem from "../Components/ShowCaseItem";

export const ShowCase = () => {
  const [folder, setFolder] = useState(null);
  const { images, loading } = useCloudinaryImages(folder);
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const handleImageClick = (folderDir, index) => {
    setFolder(`Hoang-Truc-Photographer-Portfolio/SHOW CASE/${folderDir}`);
    setStartIndex(index);
  };

  const slides = images.map(img => {
    const parts = img.public_id.split("/"); 
    const folderName = parts[parts.length - 2];

    return {
      src: img.optimized_url,
      title: folderName,
    };
});


  useEffect(() => {
    if (!loading && folder) setIsOpen(true);        // mở LightBox

  }, [loading, folder]);


  return (
    <div className="showcase-container">
      <h1 className="showcase-title">Show Case</h1>

      {/* --- Navigation Bar --- */}
      <nav>
        <ul className="showcase-nav">
          {mainPhotoList.map((image) => {
            return(
              <li key={image.key} onClick={() => scrollToElement(image.id)}><span>{image.caption}</span></li>
            )
          })}
        </ul>
      </nav>


      {/* --- Each Image (full width) --- */}
      <div className="showcase-list">
        {mainPhotoList.map((image) => {
          return (
            <div key={image.key} id={image.id} className="showcase-item fade-in" >
              {/* <p className="showcase-caption">{image.caption}</p> */}
              <ShowCaseItem
                key={image.key}
                src={image.src}
                alt={image.alt}
                className="showcase-image"
                onClick={() => handleImageClick(image.rootFolder,image.indexImageList)}
              />
            </div>
          )
        })}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* --- Lightbox Modal --- */}
      {!loading && isOpen && (
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
