import { useEffect, useState, useCallback } from "react";
import APIs, { endpoints } from "../config/APIs";

export const useEachImageOfEachFolder = (page, limit, sort, path) => {
  const [mainPhotoList, setMainPhotoList] = useState([]);
  const [loadingEachImageOfEachFolder, setLoadingEachImageOfEachFolder] = useState(false);
  const [current, setCurrent] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Wrap loadImages in useCallback so it's stable and can be called from child components
  const loadEachImageOfEachFolder = async () => {
    try {
      setLoadingEachImageOfEachFolder(true);
      const response = await APIs.get(
        `${endpoints.getEachImageOfEachFolder}?page=${page}&limit=${limit}&sort=${sort}&path=${encodeURIComponent(path)}`
      );

      if (response.status === 200) {
        setMainPhotoList(response.data.images);
        setCurrent(response.data.current);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
      } else {
        setMainPhotoList([]);
        setCurrent(0);
        setTotalPages(0);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error loading each image of each folder:", error);
      setMainPhotoList([]);
      setCurrent(0);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoadingEachImageOfEachFolder(false);
    }
  };

  
  useEffect(() => {
    loadEachImageOfEachFolder();
  }, [page, limit, sort, path]);

  return { mainPhotoList, current, totalPages, totalItems, loadingEachImageOfEachFolder, loadEachImageOfEachFolder };
};
