import { useEffect, useState } from "react";
import APIs, { endpoints } from "../config/APIs"

export const useCloudinaryImages = (directory) => {
  const [images, setImages] = useState([]);
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true)
        const response = await APIs.get(`${endpoints.getImages}?folder=${directory}`)
        if (response.status === 200) {
            setImages(response.data.images)
            setCount(response.data.count)
        }

    } catch (error) {
        console.error("Error loading images from Cloudinary:", error)
        throw error
        
    } finally {
        setLoading(false)
    }
    };

    fetchImages();
  }, [directory, count]);

  return { images, loading };
};

