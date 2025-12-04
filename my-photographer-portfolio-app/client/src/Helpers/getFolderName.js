export const handleGetFolderName = (path) => {
  return path.toString().split("/").pop();
};
