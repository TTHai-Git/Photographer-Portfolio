import { model, Schema } from "mongoose";
const FolderSchema = new Schema(
  {
    path: {
      type: String,
      require: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);
const Folder = model("Folder", FolderSchema);
export default Folder;
