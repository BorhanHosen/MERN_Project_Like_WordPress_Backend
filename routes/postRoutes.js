import express from "express";
const router = express.Router();
import PostController from "../controllers/postControllers.js";
import checkUserAuth from "../middlewares/auth-middleware.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + " " + file.originalname);
  },
});

const upload = multer({ storage });

const thumbnailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/thumbnail");
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

const thumbnailUpload = multer({ storage: thumbnailStorage });

// Public Route
router.post(
  "/createpost",
  checkUserAuth,
  thumbnailUpload.single("thumbnail"),
  PostController.CreatePost
);
router.post("/upload", upload.single("file"), (req, res) => {
  const image = req.file;
  // console.log(image);

  if (!image) {
    const error = new Error("No Image");
    error.httpStatusCode = 400;
    return next(error);
  }

  // res.status(200).send(image);
  const url = `${req.file.filename}`;
  console.log(url);
  res.status(200).send({ url });
});

router.get("/UsersAllPosts", checkUserAuth, PostController.GetAllUsersPost);
router.get("/allposts", PostController.GetPost);
router.get("/post/:id", checkUserAuth, PostController.GetSinglePost);
router.get("/posts/:id", PostController.GetSinglePostNoToken);
router.put(
  "/updatepost/:id",
  checkUserAuth,
  thumbnailUpload.single("thumbnail"),
  PostController.UpdatePost
);
router.post("/searchposts", PostController.SearchPost);
router.delete("/deletepost", PostController.DeletePost);

export default router;
