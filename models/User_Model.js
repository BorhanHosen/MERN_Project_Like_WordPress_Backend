import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    active: { type: Boolean, required: true, trim: true, default: true },
    role: { type: String, required: true, trim: true, default: "basic" },
    photoURL: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);
const User_Model = mongoose.model("User", User);

export default User_Model;
