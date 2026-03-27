import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import "../Assets/CSS/ShowCase.css";
import ShowCaseItem from "../Components/ShowCaseItem";
import { useImages } from "../hooks/loadImages";
import { handleGetFolderName } from "../Helpers/getFolderName";
import { useEachImageOfEachFolder } from "../hooks/loadEachImageOfEachFolder";
import SortBar from "../Components/SortBar";
import Pagination from "../Components/Pagination";

// Lazy load LightBox (bundle-dynamic-imports)
const LightBox = lazy(() => import("../utils/LightBox"));


export const ShowCase = () => {
  const [folder, setFolder] = useState(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const { mainPhotoList, totalPages, loadingEachImageOfEachFolder } =
    useEachImageOfEachFolder(
      page,
      8,
      sort,
      "Hoang-Truc-Photographer-Portfolio/SHOW CASE/",
    );
  const { images, loading } = useImages(1, 500, folder, "oldest");
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [pendingOpen, setPendingOpen] = useState(false);

  // Memoize handlers (rerender-memo)
  const handleImageClick = useCallback((folderDir, index) => {
    setFolder(folderDir);
    setStartIndex(index);
    setPendingOpen(true);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!loading && pendingOpen && images.length > 0) {
      const slidesData = images
        .filter((img) => img.resource_type === "image")
        .map((img) => {
          const parts = img.public_id.split("/");
          const folderName = parts[parts.length - 2];
          return { src: img.secure_url, title: folderName };
        });

      setSlides(slidesData);
      setIsOpen(true);
      setPendingOpen(false);
    }
  }, [loading, images, pendingOpen]);

  return (
    <main className="showcase-container">
      <h1 className="showcase-page-title">Showcase</h1>

      <SortBar sort={sort} onSortChange={setSort} />

      {/* --- Each Image — per-card shimmer, no full-screen overlay --- */}
      <div className="showcase-list">
        {loadingEachImageOfEachFolder && mainPhotoList.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={`sk-${i}`} className="showcase-card">
                <div 
                  className="showcase-skeleton" 
                  style={{ aspectRatio: "16/9", backgroundColor: "#f0f0f0" }} 
                />
              </div>
            ))
          : mainPhotoList?.map((image, index) => (
              <div
                key={image._id}
                id={image.folder._id}
                className="showcase-card">
                <ShowCaseItem
                  src={image.secure_url}
                  width={image.width}
                  height={image.height}
                  alt={`${handleGetFolderName(image.folder.path)} – showcase`}
                  folderName={handleGetFolderName(image.folder.path)}
                  eager={index < 4}
                  onClick={() => handleImageClick(image.folder.path, 0)}
                />
              </div>
            ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* --- Lightbox — dynamic load --- */}
      {isOpen && (
        <Suspense fallback={null}>
          <LightBox
            isOpen={isOpen}
            slides={slides}
            startIndex={startIndex}
            onClose={() => {
              setIsOpen(false);
              setFolder(null);
              setSlides([]);
            }}
          />
        </Suspense>
      )}
    </main>
  );
};

export default ShowCase;
