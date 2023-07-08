import Post_Model from "../models/Post_Model.js";

class PostController {
  static CreatePost = async (req, res) => {
    const Post_Thumbnail = req.file.filename;
    const Author = req.user._id;
    // const a = req.body;
    // console.log(a);
    const { Post_Title, Post_Category, Post_Description } = req.body;
    const Post_Title_Exists = await Post_Model.findOne({
      Post_Title: Post_Title,
    });

    if (Post_Title_Exists) {
      res.send({ status: "failed", message: "Post Title Already exists" });
    } else {
      if (Post_Title && Post_Category && Post_Thumbnail && Post_Description) {
        try {
          const New_Post = new Post_Model({
            Post_Title: Post_Title,
            Post_Category: Post_Category,
            Post_Thumbnail: Post_Thumbnail,
            Post_Description: Post_Description,
            Author: Author,
          });
          await New_Post.save();
          res.status(201).send({
            status: "success",
            message: "Create Post Successfull",
            New_Post: New_Post,
          });
        } catch (error) {
          console.log(error);
          res.send({
            status: "failed",
            message: "Unable to Create New Post",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    }
  };
  static GetPost = async (req, res) => {
    // console.log(req.query);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const PostCount = await Post_Model.find().count();
    const Post = await Post_Model.find()
      .populate("Author", "-password")
      .skip(skip)
      .limit(limit)
      .sort({
        createdAt: -1,
      });

    // console.log(PostCount);
    // const Post = await PostData.skip(skip).limit(limit);
    res.send({ Post, PostCount, limit });
  };
  static GetAllUsersPost = async (req, res) => {
    const UserId = req.user._id;
    // console.log(UserId);

    const Post = await Post_Model.find({ Author: UserId }).populate(
      "Author",
      "-password"
    );
    res.send(Post);
  };
  static GetSinglePost = async (req, res) => {
    const { id } = req.params;
    const Post = await Post_Model.findById({ _id: id }).populate(
      "Author",
      "-password"
    );
    res.send(Post);
  };
  static GetSinglePostNoToken = async (req, res) => {
    const { id } = req.params;
    const Post = await Post_Model.findById({ _id: id }).populate(
      "Author",
      "-password"
    );
    res.send(Post);
  };
  static SearchPost = async (req, res) => {
    try {
      const search = req.body.search;
      const PostData = await Post_Model.find({
        Post_Title: { $regex: ".*" + search + ".*", $options: "i" },
      });
      if (PostData.length > 0) {
        res.status(200).send({
          status: "success",
          message: "Posts Details",
          PostData,
        });
      } else {
        res
          .status(200)
          .send({ status: "success", message: "Posts Not Found!" });
      }
    } catch (error) {
      res.status(200).send({ status: "failed", message: error.message });
    }
  };
  static DeletePost = async (req, res) => {
    try {
      const { PostId } = req.body;
      const DeletePost = await Post_Model.findByIdAndDelete({ _id: PostId });
      if (DeletePost) {
        res.status(200).send({
          status: "success",
          message: "Posts Deleted Successfully...",
          DeletePost,
        });
      } else {
        res
          .status(200)
          .send({ status: "success", message: "Posts Not Found!" });
      }
    } catch (error) {
      res.status(200).send({ status: "failed", message: error.message });
    }
  };
  static UpdatePost = async (req, res) => {
    try {
      const Post_Thumbnail = req.file.filename;
      const { id } = req.params;
      const { Post_Title, Post_Category, Post_Description } = req.body;
      // console.log(Post_Thumbnail);
      if (Post_Title && Post_Category && Post_Description) {
        const UpdatePost = await Post_Model.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              Post_Title: Post_Title,
              Post_Category: Post_Category,
              Post_Thumbnail: Post_Thumbnail,
              Post_Description: Post_Description,
            },
          },
          { new: true }
        );
        res.status(201).send({
          status: "success",
          message: "Update Post Successfull",
          UpdatePost,
        });
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      res.status(200).send({ status: "failed", message: error.message });
    }
  };
}
export default PostController;
