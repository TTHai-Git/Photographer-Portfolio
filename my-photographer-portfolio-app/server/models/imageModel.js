import { model, Schema } from "mongoose";
const ImageOfCloudinarySchema = new Schema(
  {
    public_id: {
      type: String,
      require: true,
    },
    optimized_url: {
      type: String,
      require: true,
    },
    resource_type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    folderOfCloudinary: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      require: true,
    },
  },
  {
    timestamps: true,
  },
);
ImageOfCloudinarySchema.index({ folderOfCloudinary: 1, created_at: -1 });
ImageOfCloudinarySchema.index({ folderOfCloudinary: 1, public_id: 1 });
const ImageOfCloudinary = model("Image", ImageOfCloudinarySchema);
export default ImageOfCloudinary;
