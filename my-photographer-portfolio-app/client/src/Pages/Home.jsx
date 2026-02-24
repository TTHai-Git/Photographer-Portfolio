import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import LightBox from "../utils/LightBox";
import "../Assets/CSS/Home.css";
import LazyImage from "../Components/LazyImage";
import { useImages } from "../hooks/loadImages";
import SortBar from "../Components/SortBar";
import Pagination from "../Components/Pagination";

export const Home = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const { images, totalPages, loading } = useImages(
  page,
  500,
  "Hoang-Truc-Photographer-Portfolio/HOME",
  sort,
);
  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const handleImageClick = (index) => {
    const slideList = images.map((image) => ({
      src: image.optimized_url,
      title: "HOME"
    }));

    setSlides(slideList);
    setStartIndex(index);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!loading) return;
  }, [loading, sort, page]);

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

      {/* <Typography className="home-subtitle">
        Photography & Visual Storytelling
      </Typography> */}

      <SortBar sort={sort} onSortChange={setSort} />

      {/* --- Loading Overlay --- */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* --- Masonry Image Grid --- */}
      <ImageList
        variant="masonry"
        cols={3}
        gap={24}
        className="gallery-grid"
      >
        {images.map((image, index) => (
          <ImageListItem key={image._id}>
            {/* <img
              src={`${image.optimized_url}?w=auto&fit=crop&auto=format`}
              alt={image.file_name}
              onClick={() => handleImageClick(index)}
              loading="lazy"
              className="fade-in"
            /> */}
            <LazyImage
              src={image.optimized_url}
              alt={image.file_name}
              className="fade-in"
              onClick={() => handleImageClick(index)}
            />
          </ImageListItem>
        ))}
      </ImageList>
       
      <Pagination
        currentPage={page}
        totalPages={totalPages || 1}
        onPageChange={(page) => setPage(page)}
      />

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
