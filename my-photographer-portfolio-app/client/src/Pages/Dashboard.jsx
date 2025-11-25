import "../Assets/CSS/dashboard.css";

import { useState, useEffect } from "react";
import FolderList from "../Components/FolderList";
import ImageList from "../Components/ImageList";
import APIs, { endpoints } from "../config/APIs";

const  Dashboard = () => {
  const rootDir = "Hoang-Truc-Photographer-Portfolio";
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [images, setImages] = useState([]);
  const [foldersLoading, setFoldersLoading] = useState(false);
  const [actionFoldersLoading, setActionFoldersLoading] = useState(false);
  const [actionImagesLoading, setActionImagesLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);

  const loadFolders = async () => {
    try {
      setFoldersLoading(true);
      const res = await APIs.get(`${endpoints.getFolders}?rootFolder=${rootDir}`);
      setFolders(res.data.folders);
    } catch (error) {
      alert(error.response?.data?.message || "Error loading folders");
    } finally {
      setFoldersLoading(false);
    }
  };

  const loadImages = async (folder) => {
    try {
      setImagesLoading(true);
      const res = await APIs.get(`${endpoints.getImages}?folder=${folder}`);
      setImages(res.data.images);
    } catch (error) {
      alert(error.response?.data?.message || "Error loading images");
    } finally {
      setImagesLoading(false);
    }
  };


    useEffect(() => {
      loadFolders();
    }, []);

    useEffect(() => {
      if (selectedFolder) loadImages(selectedFolder);
    }, [selectedFolder]);


  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Dashboard</h2>
        </div>
        <FolderList
          folders={folders}
          loading={foldersLoading}
          actionFoldersLoading={actionFoldersLoading}
          setSelectedFolder={setSelectedFolder}
          setActionFoldersLoading={setActionFoldersLoading}
          loadFolders={loadFolders}
          setImages={setImages}
          onSelectFolder={setSelectedFolder}
        />
      </div>
      <ImageList
        folders={folders}
        selectedFolder={selectedFolder}
        images={images}
        loading={imagesLoading}
        actionImagesLoading={actionImagesLoading}
        setActionImagesLoading={setActionImagesLoading}
        loadImages={() => loadImages(selectedFolder)}
      />
    </div>
  );
}
export default Dashboard