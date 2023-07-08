import User_Model from "../models/User_Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sharp from "sharp";
class UserController {
  static UserRegistration = async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;
    const User_Exists = await User_Model.findOne({
      email: email,
    });
    if (User_Exists) {
      res.send({ status: "failed", message: "Email Already exists" });
    } else {
      if (fullName && email && password && confirmPassword) {
        if (password === confirmPassword) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new User_Model({
              fullName: fullName,
              email: email,
              password: hashPassword,
            });
            await doc.save();
            const saved_user = await User_Model.findOne({ email: email });
            // Generate JWT Token
            const token = jwt.sign(
              { UserID: saved_user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );

            res.status(201).send({
              status: "success",
              message: "Registration Successfull",
              token: token,
            });
          } catch (error) {
            console.log(error);
            res.send({ status: "failed", message: "Unable to Register" });
          }
        } else {
          res.send({
            status: "failed",
            message: "Password and Confirm Password Doesn't Match.",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    }
  };
  static UserLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await User_Model.findOne({ email: email });

        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            // Generate JWT Token
            const token = jwt.sign(
              { UserID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({
              status: "success",
              message: "Login Successful.",
              token: token,
            });
          } else {
            res.send({
              status: "failed",
              message: "Email or Password is not valid.",
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "You are not a Registered User.",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {}
  };
  static UserProfile = async (req, res) => {
    res.send({ UserProfile: req.user });
  };
  static UpdateProfilePic = async (req, res) => {
    console.log(req.file);

    await User_Model.findByIdAndUpdate(req.user._id, {
      photoURL: req.file.filename,
    });
    res.send({
      status: "success",
      message: "Update Profile Pic Successful...",
    });
  };
  static GetUser = async (req, res) => {
    const User = await User_Model.find().sort({ createdAt: "desc" });
    res.send({ User: User });
  };

  static UpdateUser = async (req, res) => {
    const { fullName, email, role, active } = req.body;
    console.log(fullName, email, role, active);
    await User_Model.findByIdAndUpdate(req.params.userId, {
      fullName,
      email,
      role,
      active,
    });
    res.send({ status: "success", message: "Update Successful..." });
  };
}
export default UserController;
