import { model, Schema } from "mongoose";

const assetSchema = new Schema(
  {
    asset_id: { type: String, required: true },

    public_id: { type: String, required: true },

    original_filename: { type: String, required: true },

    secure_url: { type: String, required: true },

    resource_type: {
      type: String,
      enum: ["image", "video"],
      required: true,
      index: true
    },

    format: { type: String, required: true },

    bytes: { type: Number, required: true },

    width: { type: Number, required: true },

    height: { type: Number, required: true },

    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
      index: true
    },

    videoMeta: {
      codec: String,
      bit_rate: Number,
      duration: Number,
      frame_rate: Number,
      resolution: String, // `${width}x${height}`
      posterUrl: String, // m3u8
      playback_url: String // chỉ video mới có
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

//
// ================= INDEX STRATEGY =================
//

// 1️⃣ Unique public_id trong cùng 1 folder
assetSchema.index({ folder: 1, public_id: 1 }, { unique: true });

// 2️⃣ Query gallery nhanh nhất (folder + type + sort newest)
assetSchema.index({
  folder: 1,
  resource_type: 1,
  createdAt: -1
});

// 3️⃣ Query tất cả media trong folder (sort mới nhất)
assetSchema.index({
  folder: 1,
  createdAt: -1
});

// 4️⃣ Soft delete optimization
assetSchema.index({
  folder: 1,
  isDeleted: 1,
  createdAt: -1
});

//
// ================= MODEL =================
//

const Asset = model("Asset", assetSchema);

export default Asset;
