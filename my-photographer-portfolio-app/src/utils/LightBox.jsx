// LightBox.jsx
import React, { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "../Assets/CSS/LightBox.css";

export const LightBox = ({ isOpen, slides, startIndex, onClose }) => {
  const [open, setOpen] = useState(isOpen);

  // Sync external isOpen state
  useEffect(() => {
    setOpen(isOpen);
    console.log("Slides", slides)
  }, [isOpen]);

  return (
    <Lightbox
      open={open}
      close={() => {
        setOpen(false);
        if (onClose) onClose();
      }}
      slides={slides}
      index={startIndex}
      plugins={[Zoom, Download, Fullscreen, Thumbnails, Captions, Slideshow]}
      captions={{
        showToggle: true,
        descriptionTextAlign: 'end'
      }}
      controller={{ closeOnBackdropClick: true }}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        render={{
            caption: ({ slide }) => (
                <div className="lightbox-caption">
                    {slide.title && <strong>{slide.title}</strong>}
                    {slide.src && <p>{slide.src}</p>}
                </div>
            ),
        }}
    />
  );
};

export default LightBox;
