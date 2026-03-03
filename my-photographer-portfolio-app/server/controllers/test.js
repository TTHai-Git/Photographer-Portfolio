import { mongoose } from "mongoose";
import Asset from "../models/assetModel.js";

export const renameMyCollection = async (req, res) => {
  try {
    // Truy cập trực tiếp vào MongoDB driver thông qua Mongoose
    const db = mongoose.connection.db;

    // Đổi tên từ 'oldCollectionName' sang 'newCollectionName'
    await db.collection("images").rename("assets");

    console.log("Đổi tên thành công, dữ liệu vẫn an toàn!");
    return res.status(200).json({ message: "Collection renamed successfully" });
  } catch (err) {
    console.error("Lỗi khi đổi tên:", err.message);
  }
};

export async function renameFields() {
  try {
    const result = await Asset.updateMany(
      {}, // An empty filter applies the update to all documents
      {
        $rename: { secure_url: "secure_url", Folder: "folder" },
      }, // The $rename operator
      { strict: false }, // Set strict to false to allow updating fields not in the schema during migration
    ).exec();

    console.log(`Updated ${result.nModified} documents`);
    return result;
  } catch (error) {
    console.error("Error during field rename:", error);
  }
}

export const AddFieldsToAsset = async (req, res) => {
  try {
    const result = await Asset.updateMany(
      {},
      [
        {
          $set: { videoMeta: null },
        },
      ],
      { updatePipeline: true }, // 👈 QUAN TRỌNG
    );

    return res.status(200).json({
      message: "isDeleted field updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
