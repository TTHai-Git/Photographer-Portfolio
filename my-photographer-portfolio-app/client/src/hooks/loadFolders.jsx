import { useState, useEffect, useCallback } from "react";
import APIs, { endpoints } from "../config/APIs";

export const useFolders = (page, limit, sort) => {
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [currentPageOfFolders, setCurrentPageOfFolders] = useState(0);
  const [totalPagesOfFolders, setTotalPagesOfFolders] = useState(0);
  const [totalItemsOfFolders, setTotalItemsOfFolders] = useState(0);

  const loadFolders = async () => {
    try {
      setLoadingFolders(true);
      const response = await APIs.get(
        `${endpoints.getFoldersFromDB}?page=${page}&limit=${limit}&sort=${sort}`
      );
      if (response.status === 200) {
        setFolders(response.data.folders);
        setCurrentPageOfFolders(response.data.current);
        setTotalPagesOfFolders(response.data.totalPages);
        setTotalItemsOfFolders(response.data.totalItems);
      } else {
        setFolders([]);
      }
    } catch (error) {
      console.error("Error loading folders", error);
    } finally {
      setLoadingFolders(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, [page, limit, sort]);

  return {
    folders,
    loadingFolders,
    currentPageOfFolders,
    totalPagesOfFolders,
    totalItemsOfFolders,
    loadFolders,
  };
};
