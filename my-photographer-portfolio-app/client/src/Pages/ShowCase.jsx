import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import "../Assets/CSS/ShowCase.css";
import ShowCaseItem from "../Components/ShowCaseItem";
import { useImages } from "../hooks/loadImages";
import { handleGetFolderName } from "../Helpers/getFolderName";
import { useEachImageOfEachFolder } from "../hooks/loadEachImageOfEachFolder";
import SortBar from "../Components/SortBar";
import Pagination from "../Components/Pagination";
import buildImageUrl from "../Helpers/buildImageUrl";

const LightBox = lazy(() => import("../utils/LightBox"));

export const ShowCase = () => {
  const [folder, setFolder] = useState(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");

  const { mainPhotoList, totalPages, loadingEachImageOfEachFolder } =
    useEachImageOfEachFolder(
      page,
      6,
      sort,
      "Hoang-Truc-Photographer-Portfolio/SHOW CASE/"
    );

  const { images, loading } = useImages(1, 200, folder, sort);

  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [pendingOpen, setPendingOpen] = useState(false);

  // 🔥 preload ảnh đầu (LCP)
  useEffect(() => {
    if (!mainPhotoList?.length) return;

    const first = mainPhotoList[0];

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = buildImageUrl(first.public_id, { width: 800 });

    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, [mainPhotoList]);

  // 🔥 click ảnh
  const handleImageClick = useCallback((folderDir, index) => {
    setFolder(folderDir);
    setStartIndex(index);
    setPendingOpen(true);
  }, []);

  // 🔥 change page
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 🔥 load slides khi mở lightbox
  useEffect(() => {
    if (!loading && pendingOpen && images.length > 0) {
      const slidesData = images
        .filter((img) => img.resource_type === "image")
        .map((img) => {
          const parts = img.public_id.split("/");
          const folderName = parts[parts.length - 2];

          return {
            src: buildImageUrl(img.public_id, {
              width: window.innerWidth
            }),
            title: folderName
          };
        });

      setSlides(slidesData);
      setIsOpen(true);
      setPendingOpen(false);
    }
  }, [loading, images, pendingOpen]);

  return (
    <main className="showcase-container">
      <h1 className="showcase-page-title">My Projects</h1>

      {mainPhotoList.length > 0 && (
        <SortBar sort={sort} onSortChange={setSort} />
      )}

      <div className="showcase-list">
        {loadingEachImageOfEachFolder && mainPhotoList.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={`sk-${i}`} className="showcase-card">
                <div className="showcase-skeleton" />
              </div>
            ))
          : mainPhotoList?.map((image, index) => (
              <div key={image._id} className="showcase-card">
                <ShowCaseItem
                  src={buildImageUrl(image.public_id, { width: 1200 })}
                  srcSet={`
                    ${buildImageUrl(image.public_id, { width: 300 })} 300w,
                    ${buildImageUrl(image.public_id, { width: 400 })} 400w,
                    ${buildImageUrl(image.public_id, { width: 800 })} 800w,
                    ${buildImageUrl(image.public_id, { width: 1200 })} 1200w
                  `}
                  sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  width={385}
                  height={481}
                  alt={image.file_name || "artwork"}
                  folderName={handleGetFolderName(image.folder.path)}
                  eager={index === 0} // 🔥 chỉ 1 ảnh eager
                  onClick={() => handleImageClick(image.folder.path, 0)}
                />
              </div>
            ))}
      </div>

      {mainPhotoList.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

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
