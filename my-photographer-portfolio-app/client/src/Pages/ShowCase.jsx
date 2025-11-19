// ShowCase.jsx
import {useEffect, useState } from "react";
import "../Assets/CSS/ShowCase.css";
import LightBox from "../utils/LightBox";
import { useCloudinaryImages } from "../hooks/loadImagesOnCloudinary";
import AMY_CAKE_CHRISTMAS_CAKE from "../Assets/Images/SHOW CASE/AMY CAKE_ CHRISTMAS CAKE/DSC04630.webp"
import AMY_CAKE_LUNAR_NEW_YEAR from "../Assets/Images/SHOW CASE/AMY CAKE_LUNAR NEW YEAR/DSC00124-2.webp"
import CHOI_XUAN_GIFT_BOX from "../Assets/Images/SHOW CASE/CHOI XUAN_GIFT BOX/choi xuan_Concept2.webp"
import GHIEN_MYSTERI_DEEP_CONNECTION_CARD from "../Assets/Images/SHOW CASE/GHIEN MYSTERI_ DEEP CONNECTION CARD/deep connection5214.webp"
import MACRO from "../Assets/Images/SHOW CASE/MACRO/chup nguoc sang0442.webp"
import NGUYEN_SAC_CANDLE from "../Assets/Images/SHOW CASE/NGUYEN SAC CANDLE/mat_ong.webp"
import PRODUCT_SET_UP from "../Assets/Images/SHOW CASE/PRODUCT SET UP/dau son.webp"
import SWIMMING_EQUIPMENT from "../Assets/Images/SHOW CASE/SWIMMING EQUIPMENT/anti fog_2.webp"
import VERDANT_COCKTAIL_BAR from "../Assets/Images/SHOW CASE/VERDANT COCKTAIL BAR/1.webp"

export const ShowCase = () => {
  const [folder, setFolder] = useState(null);
  const { images, loading } = useCloudinaryImages(folder);

  const [isOpen, setIsOpen] = useState(false);
  
  const [startIndex, setStartIndex] = useState(0);

    const handleImageClick = (folderDir, index) => {
      setFolder(`Hoang-Truc-Photographer-Portfolio/SHOW CASE/${folderDir}`);
      setStartIndex(index);
    };


  const slides = images.map(img => ({
    src: img.url,
    title: img.file_name
  }));

    useEffect(() => {
      if (!loading && folder) setIsOpen(true);        // mở LightBox

    }, [loading, folder]);


  return (
    <div className="showcase-container">
      <h1 className="showcase-title">Show Case</h1>

      {/* --- Navigation Bar --- */}
      <nav>
        <ul className="showcase-nav">
          <li><span>VERDANT COCKTAIL BAR</span></li>
          <li><span>CHOI XUAN GIFT BOX</span></li>
          <li><span>NGUYEN SAC CANDLE</span></li>
          <li><span>PRODUCT SET UP</span></li>
          <li><span>AMY CAKE LUNAR NEW YEAR</span></li>
          <li><span>AMY CAKE CHRISTMAS CAKE</span></li>
          <li><span>GHIEN MYSTERI DEEP CONNECTION CARD</span></li>
          <li><span>MACRO</span></li>
          <li><span>SWIMMING EQUIPMENT</span></li>
        </ul>
      </nav>


      {/* --- Each Image (full width) --- */}
      <div className="showcase-list">
       
        <div key={"VERDANT COCKTAIL BAR"} className="showcase-item fade-in">
          <p className="showcase-caption">VERDANT COCKTAIL BAR</p>
          <img
            src={VERDANT_COCKTAIL_BAR}
            alt={"VERDANT COCKTAIL BAR"}
            className="showcase-image"
            onClick={() => handleImageClick("VERDANT COCKTAIL BAR",0)}
          />
        </div>
        <div key={"CHOI XUAN GIFT BOX"} className="showcase-item fade-in">
          <p className="showcase-caption">CHOI XUAN GIFT BOX</p>
          <img
            src={CHOI_XUAN_GIFT_BOX}
            alt={"CHOI XUAN GIFT BOX"}
            className="showcase-image"
            onClick={() => handleImageClick("CHOI XUAN_GIFT BOX",0)}
          />
        </div>
        <div key={"NGUYEN SAC CANDLE"} className="showcase-item fade-in">
          <p className="showcase-caption">NGUYEN SAC CANDLE</p>
          <img
            src={NGUYEN_SAC_CANDLE}
            alt={"NGUYEN SAC CANDLE"}
            className="showcase-image"
            onClick={() => handleImageClick("NGUYEN SAC CANDLE",0)}
          />
        </div>
        <div key={"PRODUCT SET UP"} className="showcase-item fade-in">
          <p className="showcase-caption">PRODUCT SET UP</p>
          <img
            src={PRODUCT_SET_UP}
            alt={"PRODUCT SET UP"}
            className="showcase-image"
            onClick={() => handleImageClick("PRODUCT SET UP",0)}
          />
        </div>
        <div key={"AMY CAKE LUNAR NEW YEAR"} className="showcase-item fade-in">
          <p className="showcase-caption">AMY CAKE LUNAR NEW YEAR</p>
          <img
            src={AMY_CAKE_LUNAR_NEW_YEAR}
            alt={"AMY CAKE LUNAR NEW YEAR"}
            className="showcase-image"
            onClick={() => handleImageClick("AMY CAKE_LUNAR NEW YEAR",0)}
          />
        </div>
        <div key={"AMY CAKE CHRISTMAS CAKE"} className="showcase-item fade-in">
          <p className="showcase-caption">AMY CAKE CHRISTMAS CAKE</p>
          <img
            src={AMY_CAKE_CHRISTMAS_CAKE}
            alt={"AMY CAKE CHRISTMAS CAKE"}
            className="showcase-image"
            onClick={() => handleImageClick("AMY CAKE_CHRISTMAS CAKE",0)}
          />
        </div>
        <div key={"GHIEN MYSTERI DEEP CONNECTION CARD"} className="showcase-item fade-in">
          <p className="showcase-caption">GHIEN MYSTERI DEEP CONNECTION CARD</p>
          <img
            src={GHIEN_MYSTERI_DEEP_CONNECTION_CARD}
            alt={"GHIEN MYSTERI DEEP CONNECTION CARD"}
            className="showcase-image"
            onClick={() => handleImageClick("GHIEN MYSTERI_DEEP CONNECTION CARD",0)}
          />
        </div>
        <div key={"MACRO"} className="showcase-item fade-in">
          <p className="showcase-caption">MACRO</p>
          <img
            src={MACRO}
            alt={"MACRO"}
            className="showcase-image"
            onClick={() => handleImageClick("MACRO",0)}
          />
        </div>
        <div key={"SWIMMING EQUIPMENT"} className="showcase-item fade-in">
          <p className="showcase-caption">SWIMMING EQUIPMENT</p>
          <img
            src={SWIMMING_EQUIPMENT}
            alt={"SWIMMING EQUIPMENT"}
            className="showcase-image"
            onClick={() => handleImageClick("SWIMMING EQUIPMENT",0)}
          />
        </div>
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
