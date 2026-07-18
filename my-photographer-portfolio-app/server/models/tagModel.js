import { model, Schema } from "mongoose";
const TagSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true
    },
    color: {
      type: String,
      default: "#e7dfdfff",
      unique: true
    }
  },
  {
    timestamps: true
  }
);
const Tag = model("Tag", TagSchema);

export default Tag;
