import { useRef } from "react";
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

export default function VideoGallery() {
  const lgRef = useRef(null);

  const videos = [
  {
    poster:
      "https://res.cloudinary.com/dh5jcbzly/image/upload/v1768840324/Hoang-Truc-Photographer-Portfolio/SHOW%20CASE/COCOON_T%E1%BA%A8Y%20T%E1%BA%BE%20B%C3%80O%20CH%E1%BA%BET%20DA%20%C4%90%E1%BA%A6U/xq3hzn64dokvr2lowyyb.webp",

    thumb:
      "https://res.cloudinary.com/dh5jcbzly/image/upload/v1768840324/Hoang-Truc-Photographer-Portfolio/SHOW%20CASE/COCOON_T%E1%BA%A8Y%20T%E1%BA%BE%20B%C3%80O%20CH%E1%BA%BET%20DA%20%C4%90%E1%BA%A6U/xq3hzn64dokvr2lowyyb.webp",

    video: {
      source: [
        {
          src: "https://res.cloudinary.com/dh5jcbzly/video/upload/v1772114756/Hoang-Truc-Photographer-Portfolio/demo/98886-650523191_cwyq0y.mp4",
          type: "video/mp4",
        },
      ],
      attributes: {
        controls: true,
        preload: "metadata",
        playsInline: true,
      },
    },

    subHtml: "<h4>Portfolio Video</h4>",
  },
  {
    poster:
      "https://res.cloudinary.com/dh5jcbzly/image/upload/v1768840324/Hoang-Truc-Photographer-Portfolio/SHOW%20CASE/COCOON_T%E1%BA%A8Y%20T%E1%BA%BE%20B%C3%80O%20CH%E1%BA%BET%20DA%20%C4%90%E1%BA%A6U/xq3hzn64dokvr2lowyyb.webp",

    thumb:
      "https://res.cloudinary.com/dh5jcbzly/image/upload/v1768840324/Hoang-Truc-Photographer-Portfolio/SHOW%20CASE/COCOON_T%E1%BA%A8Y%20T%E1%BA%BE%20B%C3%80O%20CH%E1%BA%BET%20DA%20%C4%90%E1%BA%A6U/xq3hzn64dokvr2lowyyb.webp",

    video: {
      source: [
        {
          src: "https://res.cloudinary.com/dh5jcbzly/video/upload/v1772114756/Hoang-Truc-Photographer-Portfolio/demo/98886-650523191_cwyq0y.mp4",
          type: "video/mp4",
        },
      ],
      attributes: {
        controls: true,
        preload: "metadata",
        playsInline: true,
      },
    },

    subHtml: "<h4>Portfolio Video</h4>",
  },
  {
    poster:
      "https://res.cloudinary.com/dh5jcbzly/image/upload/v1768840324/Hoang-Truc-Photographer-Portfolio/SHOW%20CASE/COCOON_T%E1%BA%A8Y%20T%E1%BA%BE%20B%C3%80O%20CH%E1%BA%BET%20DA%20%C4%90%E1%BA%A6U/xq3hzn64dokvr2lowyyb.webp",

    thumb:
      "https://res.cloudinary.com/dh5jcbzly/image/upload/v1768840324/Hoang-Truc-Photographer-Portfolio/SHOW%20CASE/COCOON_T%E1%BA%A8Y%20T%E1%BA%BE%20B%C3%80O%20CH%E1%BA%BET%20DA%20%C4%90%E1%BA%A6U/xq3hzn64dokvr2lowyyb.webp",

    video: {
      source: [
        {
          src: "https://res.cloudinary.com/dh5jcbzly/video/upload/v1772114756/Hoang-Truc-Photographer-Portfolio/demo/98886-650523191_cwyq0y.mp4",
          type: "video/mp4",
        },
      ],
      attributes: {
        controls: true,
        preload: "metadata",
        playsInline: true,
      },
    },

    subHtml: "<h4>Portfolio Video</h4>",
  },
  {
    poster:
      "https://res.cloudinary.com/dh5jcbzly/image/upload/v1768840324/Hoang-Truc-Photographer-Portfolio/SHOW%20CASE/COCOON_T%E1%BA%A8Y%20T%E1%BA%BE%20B%C3%80O%20CH%E1%BA%BET%20DA%20%C4%90%E1%BA%A6U/xq3hzn64dokvr2lowyyb.webp",

    thumb:
      "https://res.cloudinary.com/dh5jcbzly/image/upload/v1768840324/Hoang-Truc-Photographer-Portfolio/SHOW%20CASE/COCOON_T%E1%BA%A8Y%20T%E1%BA%BE%20B%C3%80O%20CH%E1%BA%BET%20DA%20%C4%90%E1%BA%A6U/xq3hzn64dokvr2lowyyb.webp",

    video: {
      source: [
        {
          src: "https://res.cloudinary.com/dh5jcbzly/video/upload/v1772114756/Hoang-Truc-Photographer-Portfolio/demo/98886-650523191_cwyq0y.mp4",
          type: "video/mp4",
        },
      ],
      attributes: {
        controls: true,
        preload: "metadata",
        playsInline: true,
      },
    },

    subHtml: "<h4>Portfolio Video</h4>",
  },
  {
    poster:
      "https://res.cloudinary.com/dh5jcbzly/image/upload/v1768840324/Hoang-Truc-Photographer-Portfolio/SHOW%20CASE/COCOON_T%E1%BA%A8Y%20T%E1%BA%BE%20B%C3%80O%20CH%E1%BA%BET%20DA%20%C4%90%E1%BA%A6U/xq3hzn64dokvr2lowyyb.webp",

    thumb:
      "https://res.cloudinary.com/dh5jcbzly/image/upload/v1768840324/Hoang-Truc-Photographer-Portfolio/SHOW%20CASE/COCOON_T%E1%BA%A8Y%20T%E1%BA%BE%20B%C3%80O%20CH%E1%BA%BET%20DA%20%C4%90%E1%BA%A6U/xq3hzn64dokvr2lowyyb.webp",

    video: {
      source: [
        {
          src: "https://res.cloudinary.com/dh5jcbzly/video/upload/v1772114756/Hoang-Truc-Photographer-Portfolio/demo/98886-650523191_cwyq0y.mp4",
          type: "video/mp4",
        },
      ],
      attributes: {
        controls: true,
        preload: "metadata",
        playsInline: true,
      },
    },

    subHtml: "<h4>Portfolio Video</h4>",
  },
];

  return (
    <div className="video-gallery">
      <div className="video-grid">
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