import express from "express";
const router = express.Router();
import UserController from "../controllers/userControllers.js";
import checkUserAuth from "../middlewares/auth-middleware.js";
import { upload } from "../middlewares/image-upload-middleware.js";
import imageResize from "../middlewares/image-resize.js";
upload;
// Public Route
router.post("/register", UserController.UserRegistration);
router.post("/login", UserController.UserLogin);

// Protected Route
router.put(
  "/updateprofilepic",
  checkUserAuth,
  upload.single("ProfilePic"),
  imageResize,
  UserController.UpdateProfilePic
);

router.get("/profile", checkUserAuth, UserController.UserProfile);

router.get("/UserDetails", UserController.GetUser);
router.put("/UpdateUser/:userId", UserController.UpdateUser);

export default router;
