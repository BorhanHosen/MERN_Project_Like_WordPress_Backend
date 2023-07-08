import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();
app.use(cors());

app.use(express.json());

// app.use(express.static(path.join(__dirname, "./uploads/images")));
app.use("/admin", express.static(path.join(__dirname, "./uploads/resized")));
app.use("/post", express.static(path.join(__dirname, "./public/images")));
app.use("/posts", express.static(path.join(__dirname, "./public/images")));
app.use("/updatepost", express.static(path.join(__dirname, "./public/images")));
app.use(express.static(path.join(__dirname, "./uploads/resized")));
app.use(express.static(path.join(__dirname, "./public/images")));
app.use(express.static(path.join(__dirname, "./public/thumbnail")));
// app.use("/api/user", express.static("./uploads/images"));
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

connectDB(DATABASE_URL);

app.listen(port, () => {
  console.log(`Server listening on port at ${port}!`);
});
