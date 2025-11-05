import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import LightBox from "../utils/LightBox";
import { importAllImagesByDir } from "../utils";
import "../Assets/CSS/Home.css"; // ✅ import the CSS

export const Home = () => {
  const itemData = importAllImagesByDir(
    require.context("../Assets/Images/home", false, /\.(png|jpe?g|svg)$/)
  );

  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const handleImageClick = (index) => {
    const slideList = Object.keys(itemData).map((key) => ({
      src: itemData[key],
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

      <ImageList variant="masonry" cols={3} gap={12}>
        {Object.keys(itemData).map((key, index) => (
          <ImageListItem key={itemData[key]}>
            <img
              srcSet={`${itemData[key]}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${itemData[key]}?w=248&fit=crop&auto=format`}
              alt={key}
              onClick={() => handleImageClick(index)}
              loading="lazy"
              className="fade-in"
            />
          </ImageListItem>
        ))}
      </ImageList>

      {isOpen && (
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