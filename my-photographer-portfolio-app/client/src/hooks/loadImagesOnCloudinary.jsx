import { useEffect, useState } from "react";
import APIs, { endpoints } from "../config/APIs"

export const useCloudinaryImages = (directory) => {
  const [images, setImages] = useState([]);
  // const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("directory", directory)
    const fetchImages = async () => {
      try {
        setLoading(true)
        if (directory) {
          const response = await APIs.get(`${endpoints.getImages}?folder=${directory}`)
        if (response.status === 200) {
            setImages(response.data.images)
            // console.log("response.data.images", response.data.images)
            // setCount(response.data.count)
        }
        else {
          setImages([])
          // setCount(0)
        }
        }
    } catch (error) {
        console.error("Error loading images from Cloudinary:", error)
        throw error
        
    } finally {
        setLoading(false)
    }
    };
    fetchImages();
  }, [directory]);

  return { images, loading };
};

