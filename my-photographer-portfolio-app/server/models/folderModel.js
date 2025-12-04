import { model, Schema } from "mongoose";
const FolderOfCloudinarySchema = new Schema(
  {
    path: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
const FolderOfCloudinary = model("Folder", FolderOfCloudinarySchema);
export default FolderOfCloudinary;
