// ShowCase.jsx
import { useEffect, useState } from "react";
import "../Assets/CSS/ShowCase.css";
import LightBox from "../utils/LightBox";
import ShowCaseItem from "../Components/ShowCaseItem";
import { useImages } from "../hooks/loadImages";
import { handleGetFolderName } from "../Helpers/getFolderName";
import { useEachImageOfEachFolder } from "../hooks/loadEachImageOfEachFolder";
import SortBar from "../Components/SortBar";
import Pagination from "../Components/Pagination";

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

  const handleImageClick = (folderDir, index) => {
    setFolder(folderDir);
    setStartIndex(index);
    setPendingOpen(true);
  };

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
        {loadingEachImageOfEachFolder
          ? /* Skeleton cards while list loads */
            Array.from({ length: 8 }).map((_, i) => (
              <div key={`sk-${i}`} className="showcase-card">
                <div className="showcase-skeleton" />
              </div>
            ))
          : mainPhotoList?.map((image, index) => (
              <div
                key={image._id}
                id={image.folder._id}
                className="showcase-card">
                <ShowCaseItem
                  key={image._id}
                  src={image.secure_url}
                  alt={`${handleGetFolderName(image.folder.path)} – showcase project by Hoang Truc`}
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
        onPageChange={(page) => setPage(page)}
      />

      {/* --- Lightbox — opens automatically once folder images are ready --- */}
      {isOpen && (
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
      )}
    </main>
  );
};

export default ShowCase;
