// ShowCase.jsx
import {useEffect, useState } from "react";
import "../Assets/CSS/ShowCase.css";
import LightBox from "../utils/LightBox";
import { NavLink } from "react-router-dom";
import { useCloudinaryImages } from "../hooks/loadImagesOnCloudinary";
import AMY_CAKE_CHRISTMAS_CAKE from "../Assets/Images/SHOW CASE/AMY CAKE_ CHRISTMAS CAKE/DSC04630.webp"
import AMY_CAKE_LUNAR_NEW_YEAR from "../Assets/Images/SHOW CASE/AMY CAKE_LUNAR NEW YEAR/DSC00124-2.webp"
import CHOI_XUAN_GIFT_BOX from "../Assets/Images/SHOW CASE/CHOI XUAN_GIFT BOX/choi xuan_Concept2.webp"
import GHIEN_MYSTERI_DEEP_CONNECTION_CARD from "../Assets/Images/SHOW CASE/GHIEN MYSTERI_ DEEP CONNECTION CARD/deep connection5214.webp"
import MACRO from "../Assets/Images/SHOW CASE/MACRO/chup nguoc sang0442.webp"
import NGUYEN_SAC_CANDLE from "../Assets/Images/SHOW CASE/NGUYEN SAC CANDLE/mat ong.webp"
import NGUYEN_SAC_CANDLE_DUONG from "../Assets/Images/SHOW CASE/NGUYEN SAC CANDLE/DUONG/LAY 1.webp"
import NGUYEN_SAC_CANDLE_GIEO from "../Assets/Images/SHOW CASE/NGUYEN SAC CANDLE/GIEO/hu nen don_2.webp"
import NGUYEN_SAC_CANDLE_LANG from "../Assets/Images/SHOW CASE/NGUYEN SAC CANDLE/LANG/lay 1.webp"
import PRODUCT_SET_UP from "../Assets/Images/SHOW CASE/PRODUCT SET UP/dau son.webp"
import SWIMMING_EQUIPMENT from "../Assets/Images/SHOW CASE/SWIMMING EQUIPMENT/anti fog_2.webp"
import VERDANT_COCKTAIL_BAR from "../Assets/Images/SHOW CASE/VERDANT COCKTAIL BAR/1.webp"

export const ShowCase = () => {
  const [folder, setFolder] = useState(null);
  const [openLoading, setOpenLoading] = useState(false);
  const { images, loading } = useCloudinaryImages(folder);

  const [isOpen, setIsOpen] = useState(false);
  
  const [startIndex, setStartIndex] = useState(0);

    const handleImageClick = (folderDir, index) => {
      setOpenLoading(true); // bật loading trước
      setFolder(`Hoang-Truc-Photographer-Portfolio/SHOW CASE/${folderDir}`);
      setStartIndex(index);
    };


  const slides = images.map(img => ({
    src: img.url,
    title: img.file_name
  }));

    useEffect(() => {
      if (!loading && folder) {
        setOpenLoading(false); // tắt loading
        setIsOpen(true);        // mở LightBox
      }
    }, [loading, folder]);


  return (
    <div className="showcase-container">
      <h1 className="showcase-title">Showcase</h1>

      {/* --- Navigation Bar --- */}
      <nav>
        <ul className="showcase-nav">
          <li>
            <NavLink 
              
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>AMY CAKE CHRISTMAS CAKE</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
             
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>AMY CAKE LUNAR NEW YEAR</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>CHOI XUAN GIFT BOX</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
             
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>GHIEN MYSTERI DEEP CONNECTION CARD</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>Macro</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>Nguyen Sac Candle</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>Product Set Up</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>Swimming Equipment</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <span>VERDANT COCKTAIL BAR</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* --- Each Image (full width) --- */}
      <div className="showcase-list">
       
        <div key={"1.AMY CAKE_CHRISTMAS CAKE"} className="showcase-item fade-in">
          <p className="showcase-caption">1.AMY CAKE_CHRISTMAS CAKE</p>
          <img
            src={AMY_CAKE_CHRISTMAS_CAKE}
            alt={"1.AMY CAKE_CHRISTMAS CAKE"}
            className="showcase-image"
            onClick={() => handleImageClick("AMY CAKE_CHRISTMAS CAKE",0)}
          />
        </div>
        <div key={"2.AMY_CAKE_LUNAR_NEW_YEAR"} className="showcase-item fade-in">
          <p className="showcase-caption">2.AMY CAKE_LUNAR NEW_YEAR</p>
          <img
            src={AMY_CAKE_LUNAR_NEW_YEAR}
            alt={"2.AMY_CAKE_LUNAR_NEW_YEAR "}
            className="showcase-image"
            onClick={() => handleImageClick("AMY CAKE_LUNAR NEW YEAR",0)}
          />
        </div>
        <div key={"3.CHOI_XUAN_GIFT_BOX"} className="showcase-item fade-in">
          <p className="showcase-caption">3.CHOI XUAN_GIFT BOX</p>
          <img
            src={CHOI_XUAN_GIFT_BOX}
            alt={"3.CHOI_XUAN_GIFT_BOX"}
            className="showcase-image"
            onClick={() => handleImageClick("CHOI XUAN_GIFT BOX",0)}
          />
        </div>
        <div key={"4.GHIEN_MYSTERI_DEEP_CONNECTION_CARD"} className="showcase-item fade-in">
          <p className="showcase-caption">4.GHIEN MYSTERI_DEEP CONNECTION CARD</p>
          <img
            src={GHIEN_MYSTERI_DEEP_CONNECTION_CARD}
            alt={"4.GHIEN_MYSTERI_DEEP_CONNECTION_CARD"}
            className="showcase-image"
            onClick={() => handleImageClick("GHIEN MYSTERI_DEEP CONNECTION CARD",0)}
          />
        </div>
        <div key={"5.MACRO"} className="showcase-item fade-in">
          <p className="showcase-caption">5.MACRO</p>
          <img
            src={MACRO}
            alt={"5.MACRO"}
            className="showcase-image"
            onClick={() => handleImageClick("MACRO",0)}
          />
        </div>
        <div key={"6.NGUYEN_SAC_CANDLE"} className="showcase-item fade-in">
          <p className="showcase-caption">6.NGUYEN SAC CANDLE</p>
          <img
            src={NGUYEN_SAC_CANDLE}
            alt={"6.NGUYEN_SAC_CANDLE"}
            className="showcase-image"
            onClick={() => handleImageClick("NGUYEN SAC CANDLE",0)}
          />
        </div>
        <div key={"7.NGUYEN_SAC_CANDLE_DUONG"} className="showcase-item fade-in">
          <p className="showcase-caption">7.NGUYEN SAC CANDLE DUONG</p>
          <img
            src={NGUYEN_SAC_CANDLE_DUONG}
            alt={"7.NGUYEN_SAC_CANDLE_DUONG"}
            className="showcase-image"
            onClick={() => handleImageClick("NGUYEN SAC CANDLE/DUONG",0)}
          />
        </div>
        <div key={"8.NGUYEN_SAC_CANDLE_GIEO"} className="showcase-item fade-in">
          <p className="showcase-caption">8.NGUYEN SAC CANDLE GIEO</p>
          <img
            src={NGUYEN_SAC_CANDLE_GIEO}
            alt={"8.NGUYEN_SAC_CANDLE_GIEO"}
            className="showcase-image"
            onClick={() => handleImageClick("NGUYEN SAC CANDLE/GIEO",0)}
          />
        </div>
        <div key={"9.NGUYEN_SAC_CANDLE_LANG"} className="showcase-item fade-in">
          <p className="showcase-caption">9.NGUYEN SAC CANDLE LANG</p>
          <img
            src={NGUYEN_SAC_CANDLE_LANG}
            alt={"9.NGUYEN_SAC_CANDLE_LANG"}
            className="showcase-image"
            onClick={() => handleImageClick("NGUYEN SAC CANDLE/LANG",0)}
          />
        </div>
        <div key={"10.PRODUCT_SET_UP"} className="showcase-item fade-in">
          <p className="showcase-caption">10.PRODUCT SET UP</p>
          <img
            src={PRODUCT_SET_UP}
            alt={"10.PRODUCT_SET_UP"}
            className="showcase-image"
            onClick={() => handleImageClick("PRODUCT SET UP",0)}
          />
        </div>
        <div key={"11.SWIMMING_EQUIPMENT"} className="showcase-item fade-in">
          <p className="showcase-caption">11.SWIMMING EQUIPMENT</p>
          <img
            src={SWIMMING_EQUIPMENT}
            alt={"11.SWIMMING_EQUIPMENT"}
            className="showcase-image"
            onClick={() => handleImageClick("SWIMMING EQUIPMENT",0)}
          />
        </div>
        <div key={"12.VERDANT_COCKTAIL_BAR"} className="showcase-item fade-in">
          <p className="showcase-caption">12.VERDANT COCKTAIL BAR</p>
          <img
            src={VERDANT_COCKTAIL_BAR}
            alt={"12.VERDANT_COCKTAIL_BAR"}
            className="showcase-image"
            onClick={() => handleImageClick("VERDANT COCKTAIL BAR",0)}
          />
        </div>
      </div>

      {openLoading && (
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
