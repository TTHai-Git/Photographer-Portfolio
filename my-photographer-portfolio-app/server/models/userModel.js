import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", UserSchema);
export default User;
