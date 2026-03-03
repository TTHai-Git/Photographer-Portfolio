import { model, Schema } from "mongoose";
const FolderSchema = new Schema(
  {
    path: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);
const Folder = model("Folder", FolderSchema);
export default Folder;
