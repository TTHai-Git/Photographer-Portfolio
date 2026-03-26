import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import LightBox from "../utils/LightBox";
import "../Assets/CSS/Home.css";
import LazyImage from "../Components/LazyImage";
import EagerImage from "../Components/EagerImage";
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
    sort
  );
  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const handleImageClick = (index) => {
    const slideList = images
      .filter((image) => image.resource_type === "image")
      .map((image) => ({
        src: image.secure_url,
        title: "HOME"
      }));

    setSlides(slideList);
    setStartIndex(index);
    setIsOpen(true);
  };

  return (
    <Box component="main" className="home-container">
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        className="home-heading">
        Welcome to My Photography Portfolio
      </Typography>

      <SortBar sort={sort} onSortChange={setSort} />

      {/* --- Masonry Image Grid --- */}
      <ImageList variant="masonry" cols={3} gap={24} className="gallery-grid">
        {loading
          ? /* Skeleton placeholders while data fetches */
            Array.from({ length: 9 }).map((_, i) => (
              <ImageListItem key={`skeleton-${i}`}>
                <div className="image-skeleton" />
              </ImageListItem>
            ))
          : images.map((image, index) => (
              <ImageListItem key={image._id}>
                {index < 6 ? (
                  <EagerImage
                    src={image.secure_url}
                    alt={`Portfolio photograph ${index + 1} - ${image.file_name || "artwork"}`}
                    onClick={() => handleImageClick(index)}
                  />
                ) : (
                  <LazyImage
                    src={image.secure_url}
                    alt={`Portfolio photograph ${index + 1} - ${image.file_name || "artwork"}`}
                    onClick={() => handleImageClick(index)}
                  />
                )}
              </ImageListItem>
            ))}
      </ImageList>

      <Pagination
        currentPage={page}
        totalPages={totalPages || 1}
        onPageChange={(page) => setPage(page)}
      />

      {/* --- LightBox --- */}
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
