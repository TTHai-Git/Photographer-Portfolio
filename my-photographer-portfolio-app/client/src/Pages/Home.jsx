import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useSearchParams } from 'react-router-dom';
import LightBox from "../utils/LightBox";
import "../Assets/CSS/Home.css";
import LazyImage from "../Components/LazyImage";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useImages } from "../hooks/loadImages";

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const { images, totalPages, loading } = useImages(
  page,
  6,
  "Hoang-Truc-Photographer-Portfolio/HOME",
  "oldest"
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

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() });
    }
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
       {/* Pagination */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button onClick={() => changePage(1)} disabled={page === 1}>
          First
        </Button>

        <Button onClick={() => changePage(page - 1)} disabled={page === 1}>
          Previous
        </Button>

        <Typography variant="body1">
          Page {page} of {totalPages}
        </Typography>

        <Button onClick={() => changePage(page + 1)} disabled={page === totalPages}>
          Next
        </Button>

        <Button onClick={() => changePage(totalPages)} disabled={page === totalPages}>
          Last
        </Button>
      </Stack>


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
