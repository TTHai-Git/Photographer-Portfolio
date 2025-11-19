import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import LightBox from "../utils/LightBox";
import "../Assets/CSS/Home.css";
import { useCloudinaryImages } from "../hooks/loadImagesOnCloudinary";

export const Home = () => {
  const { images, loading } = useCloudinaryImages("Hoang-Truc-Photographer-Portfolio/HOME");

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
    <Box className="home-container">
      <Typography
        variant="h3"
        component="div"
        gutterBottom
        align="center"
        className="home-heading"
      >
        Welcome to My Photography Portfolio
      </Typography>

      {/* --- Loading Overlay --- */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* --- Masonry Image Grid --- */}
      <ImageList variant="masonry" cols={3} gap={12}>
        {images.map((image, index) => (
          <ImageListItem key={image.asset_id}>
            <img
              src={`${image.url}?w=auto&fit=crop&auto=format`}
              alt={image.file_name}
              onClick={() => handleImageClick(index)}
              loading="lazy"
              className="fade-in"
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* --- LightBox --- */}
      {!loading && isOpen && (
        <LightBox
          isOpen={isOpen}
          slides={slides}
          startIndex={startIndex}
          onClose={() => setIsOpen(false)}
        />
      )}
    </Box>
  );
};

export default Home;
