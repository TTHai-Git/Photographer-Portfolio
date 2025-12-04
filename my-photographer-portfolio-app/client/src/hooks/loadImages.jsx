import { useEffect, useState, useCallback } from "react";
import APIs, { endpoints } from "../config/APIs";

export const useImages = (page, limit, directory, sort) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Wrap loadImages in useCallback so it's stable and can be called from child components
  const loadImages = async () => {
    if (!directory) {
      setImages([]);
      setCurrent(0);
      setTotalPages(0);
      setTotalItems(0);
      return;
    }

    try {
      setLoading(true);

      const response = await APIs.get(
        `${endpoints.getImagesFromDB}?path=${directory}&page=${page}&limit=${limit}&sort=${sort}`
      );

      if (response.status === 200) {
        setImages(response.data.images);
        setCurrent(response.data.current);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
      } else {
        setImages([]);
        setCurrent(0);
        setTotalPages(0);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error loading images:", error);
      setImages([]);
      setCurrent(0);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    loadImages();
  }, [directory, page, limit, sort]);

  return { images, current, totalPages, totalItems, loading, loadImages };
};
