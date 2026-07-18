import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useEffect, useRef, useState } from "react";
import LightBox from "../utils/LightBox";
import "../Assets/CSS/Home.css";
import { useImages } from "../hooks/loadImages";
import Pagination from "../Components/Pagination";
import buildImageUrl from "../Helpers/buildImageUrl";
import TagFilter from "../Components/TagFilter";
import SortBarBassic from "../Components/SortBarBassic";

export const Home = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const [selectedTags, setSelectedTags] = useState([]);
  const tagNamesStr = selectedTags.map((t) => t.name).join(",");

  const { images, totalPages, loading } = useImages(
    page,
    60,
    "Hoang-Truc-Photographer-Portfolio/HOME",
    sort,
    tagNamesStr
  );

  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  // 🔥 LCP detection
  const [lcpIndex, setLcpIndex] = useState(null);
  const imgRefs = useRef([]);

  useEffect(() => {
    if (!images?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => b.boundingClientRect.height - a.boundingClientRect.height
          );

        if (visible.length > 0) {
          const index = Number(visible[0].target.dataset.index);
          setLcpIndex(index);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    imgRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [images]);

  // 🔥 Preload LCP image
  useEffect(() => {
    if (lcpIndex === null) return;
    const img = images[lcpIndex];
    if (!img) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = buildImageUrl(img.public_id, { width: 800 });

    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, [lcpIndex, images]);

  // 🔥 Lightbox
  const handleImageClick = (index) => {
    const imageSlides = images.map((image) => {
      const parts = image.public_id.split("/");
      const folderName = parts[parts.length - 2];
      return {
        src: buildImageUrl(image.public_id, {
          width: window.innerWidth
        }),
        title: folderName
      };
    });

    setSlides(imageSlides);
    setStartIndex(index);
    setIsOpen(true);
  };

  return (
    <Box component="main" className="home-container">
      {/* <Typography variant="h3" align="center" className="home-heading">
        Welcome to My Photography Portfolio
      </Typography> */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
          padding: "0 10px"
        }}>
        <SortBarBassic sort={sort} onSortChange={setSort} />
        <TagFilter selectedTags={selectedTags} onTagsChange={setSelectedTags} />
      </Box>

      <ImageList variant="masonry" cols={3} gap={24} className="gallery-grid">
        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
              <ImageListItem key={`skeleton-${i}`}>
                <div className="image-skeleton" />
              </ImageListItem>
            ))
          : images.map((image, index) => {
              const isLCP = index === lcpIndex;

              return (
                <ImageListItem key={image._id}>
                  <img
                    ref={(el) => (imgRefs.current[index] = el)}
                    data-index={index}
                    src={buildImageUrl(image.public_id, { width: 400 })}
                    srcSet={`
                      ${buildImageUrl(image.public_id, { width: 300 })} 300w,
                      ${buildImageUrl(image.public_id, { width: 400 })} 400w,
                      ${buildImageUrl(image.public_id, { width: 800 })} 800w,
                      ${buildImageUrl(image.public_id, { width: 1200 })} 1200w
                    `}
                    sizes="(max-width: 600px) 100vw,
                           (max-width: 900px) 50vw,
                           (max-width: 1200px) 33vw,
                           385px"
                    width={385}
                    height={481}
                    alt={`Portfolio photograph ${index + 1}`}
                    onClick={() => handleImageClick(index)}
                    loading={isLCP ? "eager" : "lazy"}
                    fetchPriority={isLCP ? "high" : "auto"}
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "auto",
                      aspectRatio: "385 / 481",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                </ImageListItem>
              );
            })}
      </ImageList>

      {images.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages || 1}
          onPageChange={setPage}
        />
      )}

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
