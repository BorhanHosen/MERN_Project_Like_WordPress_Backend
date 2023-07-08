import mongoose from "mongoose";

const Post = new mongoose.Schema(
  {
    Post_Title: { type: String, required: true, trim: true },
    Post_Category: { type: String, required: true, trim: true },
    Post_Thumbnail: { type: String, required: true, trim: true },
    Post_Description: { type: String, required: true, trim: true },
    Author: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
const Post_Model = mongoose.model("Post", Post);

export default Post_Model;
