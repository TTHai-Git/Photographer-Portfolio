import "../Assets/CSS/dashboard.css";
import { useState, useEffect } from "react";
import ImageList from "../Components/ImageList";
import APIs, { authApi, endpoints } from "../config/APIs";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";
import FolderList from "../Components/FolderList";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Folder params (tách riêng)
  const [folderParams, setFolderParams] = useState({
    page: 1,
    search: "",
    sortFolders: "",
  });

  // Image params (tách riêng)
  const [imageParams, setImageParams] = useState({
    page: 1,
    sortImages: "",
  });

  const [folders, setFolders] = useState([]);
  const [foldersForCombobox, setFoldersForCombobox] = useState([]);
  const [images, setImages] = useState([]);

  const [loadingFolders, setLoadingFolders] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  const [selectedFolder, setSelectedFolder] = useState("");

  const [totalPagesOfFolders, setTotalPagesOfFolders] = useState(0);
  const [totalPagesOfImages, setTotalPagesOfImages] = useState(0);

  const sortFileds = [
    { label: "Latest", id: "latest" },
    { label: "Oldest", id: "oldest" },
    { label: "A-Z", id: "az" },
    { label: "Z-A", id: "za" },
    { label: "None", id: "none" },
  ];

  /** Load folders */
  const loadFolders = async () => {
    try {
      setLoadingFolders(true);
      const res = await APIs.get(
        `${endpoints.getFoldersFromDB}?page=${folderParams.page}&limit=10&search=${folderParams.search.trim()}&sortFolders=${folderParams.sortFolders}`
      );
      setFolders(res.data.folders);
      setTotalPagesOfFolders(res.data.totalPages);
    } finally {
      setLoadingFolders(false);
    }
  };

  /** For MoveImageModal, UploadImageModal */
  const loadFoldersForCombobox = async () => {
    const res = await APIs.get(
      `${endpoints.getFoldersFromDB}?page=1&limit=500&sort=oldest`
    );
    setFoldersForCombobox(res.data.folders);
  };

  /** Load images inside folder */
  const loadImages = async () => {
    if (!selectedFolder) return;

    try {
      setLoadingImages(true);
      const res = await authApi.get(
        `${endpoints.getImagesFromDB}?path=${selectedFolder}&page=${imageParams.page}&limit=10&sortImages=${imageParams.sortImages}`
      );
      setImages(res.data.images);
      setTotalPagesOfImages(res.data.totalPages);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
  if (!user) navigate("/login")
  const delayDebounce = setTimeout(() => {
    loadFolders(); // chỉ gọi API khi người dùng ngừng gõ 500ms
  }, 1500);

  return () => clearTimeout(delayDebounce);
}, [folderParams.search, folderParams.sortFolders, folderParams.page]);


  /** Load image list when selectedFolder OR imageParams changed */
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
    loadImages(); // chỉ gọi API khi người dùng ngừng gõ 500ms
  }, 500);

  return () => clearTimeout(delayDebounce);
  }, [selectedFolder, imageParams.sortImages, imageParams.page]);

  return (
    <div className="dashboard">
      {/* LEFT */}
      <div className="sidebar-left">
        <h2>THƯ VIỆN ẢNH</h2>

        <FolderList
          folders={folders}
          foldersForCombobox={foldersForCombobox}
          loadFoldersForCombobox={loadFoldersForCombobox}
          loading={loadingFolders}
          setImages={setImages}
          loadFolders={loadFolders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          folderParams={folderParams}
          setFolderParams={setFolderParams}
          sortFileds={sortFileds}
        />

        <Pagination
          page={folderParams.page}
          total={totalPagesOfFolders}
          onPageChange={(p) =>
            setFolderParams((prev) => ({ ...prev, page: p }))
          }
        />
      </div>

      {/* RIGHT */}
      <div className="sidebar-right">
        <ImageList
          foldersForCombobox={foldersForCombobox}
          loadFoldersForCombobox={loadFoldersForCombobox}
          selectedFolder={selectedFolder}
          images={images}
          loading={loadingImages}
          loadImages={loadImages}
          imageParams={imageParams}
          setImageParams={setImageParams}
          sortFileds={sortFileds}
        />

        {selectedFolder && (
          <Pagination
            page={imageParams.page}
            total={totalPagesOfImages}
            onPageChange={(p) =>
              setImageParams((prev) => ({ ...prev, page: p }))
            }
          />
        )}
      </div>
    </div>
  );
}

function Pagination({ page, total, onPageChange }) {
  if (!total) return null;

  return (
    <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
      <Button onClick={() => onPageChange(1)} disabled={page === 1}>First</Button>
      <Button onClick={() => onPageChange(page - 1)} disabled={page === 1}>Prev</Button>

      <Typography>Page {page} / {total}</Typography>

      <Button onClick={() => onPageChange(page + 1)} disabled={page === total}>Next</Button>
      <Button onClick={() => onPageChange(total)} disabled={page === total}>Last</Button>
    </Stack>
  );
}
