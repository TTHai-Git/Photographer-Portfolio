import { useEffect, useState } from "react";
import APIs, { endpoints } from "../config/APIs"

export const useCloudinaryFolders = (rootFolder) => {
  const [folders, setFolders] = useState([]);
  // const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log("rootFolder", rootFolder)
    const fetchImages = async () => {
      try {
        setLoading(true)
        if (rootFolder) {
          const response = await APIs.get(`${endpoints.getFolders}?rootFolder=${rootFolder}`)
        if (response.status === 200) {
            setFolders(response.data.folders)
            // console.log("response.data.folders", response.data.folders)
            // setCount(response.data.count)
        }
        else {
          setFolders([])
          // setCount(0)
        }
        }
    } catch (error) {
        console.error("Error loading folders from Cloudinary:", error)
        throw error
        
    } finally {
        setLoading(false)
    }
    };
    fetchImages();
  }, [rootFolder]);

  return { folders, loading };
};

