import { useEffect, useRef, useState } from "react";
import LightGallery from "lightgallery/react";

import lgVideo from "lightgallery/plugins/video";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgPager from "lightgallery/plugins/pager";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-video.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-pager.css";

import "../Assets/CSS/VideoGallery.css";
import { useImages } from "../hooks/loadImages";
import SortBar from "../Components/SortBar";
import Pagination from "../Components/Pagination";

export default function VideoGallery() {
  const lgRef = useRef(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const { images, totalPages, loading, } = useImages(
    page, 
    4, 
    "Hoang-Truc-Photographer-Portfolio/Animation",
    sort, 
    );
  const [videos, setVideos] = useState([])

  const getVideoFormats = (url, format) => {
    // Map of supported video formats to MIME types
    const formatMap = {
      mp4: "video/mp4",
      webm: "video/webm",
      ogv: "video/ogg",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
      mkv: "video/x-matroska",
      flv: "video/x-flv",
      wmv: "video/x-ms-wmv",
      m4v: "video/x-m4v",
    };

    // Get the original format from the URL
    const fileFormat = format?.toLowerCase() || url.split(".").pop().toLowerCase();
    const mimeType = formatMap[fileFormat] || "video/mp4";

    // Return multiple format sources for better browser compatibility
    const sources = [
      {
        src: url,
        type: mimeType,
      }
    ];

    // Add WebM version if available and original is not WebM
    if (fileFormat !== "webm") {
      sources.push({
        src: url.replace(/\.\w+$/, ".webm"),
        type: "video/webm",
      });
    }

    // Add MP4 fallback if original is not MP4
    if (fileFormat !== "mp4") {
      sources.push({
        src: url.replace(/\.\w+$/, ".mp4"),
        type: "video/mp4",
      });
    }

    return sources;
  };

  const loadVideos = () => {
    const videosData = images.filter(img => img.resource_type === "video").map(video => {
      
      return {
        poster: video.secure_url.replace(/\.\w+$/, ".webp"),
        thumb: video.secure_url.replace(/\.\w+$/, ".webp"),
        video: {
          source: getVideoFormats(video.secure_url, video.format),
          attributes: {
            controls: true,
            preload: "metadata",
            playsInline: true,
          }
        },
        subHtml: "<h4>" + video.original_filename + "</h4>",
      }
    });
    return  videosData;
  };

  useEffect(() => {
    if (!loading && images.length > 0) {
      const videosData = loadVideos();
      setVideos(videosData);
    }
  }, [loading, images, sort, page]);


  return (
    <div className="video-gallery">
      <SortBar sort={sort} onSortChange={setSort} />
      <div className="video-grid">
        {loading ? (
          
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
            
        ) : videos.length === 0 ? (
          <div className="no-videos">No videos found (Comming Soon).</div>
        ) : null}
        {videos.map((item, index) => (
          <div
            key={index}
            className="video-card"
            onClick={() => lgRef.current.openGallery(index)}
          >
            <img
              src={item.poster}
              alt="Video thumbnail"
              className="video-thumbnail"
            />
            <div className="video-overlay"></div>
            <div className="play-button">▶</div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(page) => setPage(page)}
      />

      <LightGallery
        onInit={(detail) => (lgRef.current = detail.instance)}
        plugins={[lgVideo, lgThumbnail, lgFullscreen]}
        dynamic
        dynamicEl={videos}
        thumbnail={true}
        fullScreen={true}
        download={false}
        pager={false}
        videoAutoplay={false}
        autoplayFirstVideo={false}
        videojs={false}
        addClass="lg-video-custom"
        mode="lg-fade"
        speed={300}
      />
    </div>
  );
}