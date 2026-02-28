// ShowCase.jsx
import {useEffect, useState } from "react";
import "../Assets/CSS/ShowCase.css";
import LightBox from "../utils/LightBox";
// import { scrollToElement } from "../Helpers/ScrollToElement";
import ShowCaseItem from "../Components/ShowCaseItem";
import { useImages } from "../hooks/loadImages";
// import useFolders from "../hooks/loadFolders";
import { handleGetFolderName } from "../Helpers/getFolderName";
import { useEachImageOfEachFolder } from "../hooks/loadEachImageOfEachFolder";
import SortBar from "../Components/SortBar";
import Pagination from "../Components/Pagination";

export const ShowCase = () => {
  const [folder, setFolder] = useState(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  // const {folders, loadingFolders} = useFolders(1, 500, "oldest")
  const {mainPhotoList, totalPages, loadingEachImageOfEachFolder} = useEachImageOfEachFolder(page, 8, sort, "Hoang-Truc-Photographer-Portfolio/SHOW CASE/");
  const { images, loading } = useImages(1,500,folder, "oldest");
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [slides, setSlides] = useState([])
  const [pendingOpen, setPendingOpen] = useState(false);

  const handleImageClick = (folderDir, index) => {
    setFolder(folderDir);
    setStartIndex(index);
    setPendingOpen(true); // đánh dấu chờ load ảnh
    
  };

  useEffect(() => {
  if (!loading && pendingOpen && images.length > 0) {
    const slidesData = images.filter(img => img.resource_type === "image").map(img => {
      const parts = img.public_id.split("/");
      const folderName = parts[parts.length - 2];

      return {
        src: img.optimized_url,
        title: folderName,
      };
    });

    setSlides(slidesData);
    setIsOpen(true);
    setPendingOpen(false);
  }
}, [loading, images, pendingOpen]);



  return (
    <div className="showcase-container">
      {/* <h1 className="showcase-title">Show Case</h1> */}

      {/* --- Navigation Bar --- */}
      {/* <nav>
        <ul className="showcase-nav">
          {loadingEachImageOfEachFolder ? (
            <li>Loading Folders...</li>
          ) : (
            <>
              {mainPhotoList.filter(f =>
                f.folderOfCloudinary.path.startsWith("Hoang-Truc-Photographer-Portfolio/SHOW CASE/")
              ).map(folder => (
                <li
                  key={folder.folderOfCloudinary._id}
                  onClick={() => scrollToElement(folder.folderOfCloudinary._id)}
                >
                  <span>{handleGetFolderName(folder.folderOfCloudinary.path)}</span>
                </li>
              ))}
            </>
          )}
        </ul>
      </nav> */}

      <SortBar sort={sort} onSortChange={setSort} />

      {/* --- Each Image (full width) --- */}
      <div className="showcase-list">
        {loadingEachImageOfEachFolder ? (
          <p>Loading Images...</p>
        ) : (
          <>
            {mainPhotoList?.map((image) => {
              return (
                <div key={image._id} id={image.folderOfCloudinary._id} className="showcase-card fade-in" >
                  {/* <p className="showcase-caption">{image.caption}</p> */}
                  <ShowCaseItem
                    key={image._id}
                    src={image.optimized_url}
                    alt={image.public_id}
                    folderName={handleGetFolderName(image.folderOfCloudinary.path)}
                    className="showcase-image"
                    onClick={() => handleImageClick(image.folderOfCloudinary.path,0)}
                  />
                </div>
              )
            })}
              </>
            )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(page) => setPage(page)}
      />

      {loading && loadingEachImageOfEachFolder  && pendingOpen && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* --- Lightbox Modal --- */}
      {!loading && isOpen && (
        <LightBox
          isOpen={isOpen}
          slides={slides}
          startIndex={startIndex}
          onClose={() => {
            setIsOpen(false)
            setFolder(null)
            setSlides([])
          }}
        />
      )}
    </div>
  );
};

export default ShowCase;
