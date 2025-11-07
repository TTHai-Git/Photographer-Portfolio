import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import LightBox from "../utils/LightBox";
import "../Assets/CSS/Home.css"; // ✅ import the CSS
import { loadImagesByDir } from "../hooks/loadImagesData";

export const Home = () => {
  const [itemData, setItemData] = useState({})
  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const handleImageClick = (index) => {
    const slideList = Object.keys(itemData).map((key) => ({
      src: itemData[key],
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
    setItemData(loadImagesByDir(require.context("../Assets/Images/home/webp/", false, /\.(png|jpe?g|svg|webp)$/)))
  }, [])

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
              src={`${itemData[key]}?w=auto&fit=crop&auto=format`}
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