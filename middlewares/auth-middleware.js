import jwt from "jsonwebtoken";
import User_Model from "../models/User_Model.js";

var checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      // verify token
      const { UserID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // Get User from token
      req.user = await User_Model.findById(UserID).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({ status: "failed", message: "Unauthorized User" });
    }
  }
  if (!token) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized User, No Token" });
  }
};
export default checkUserAuth;
