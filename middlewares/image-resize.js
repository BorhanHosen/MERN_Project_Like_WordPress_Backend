import sharp from "sharp";
const imageResize = (req, res, next) => {
  // File has been uploaded, now let's resize it
  console.log(req.file.path);
  sharp(req.file.path)
    .resize(500, 500) // Set the desired width and height for the resized image
    .toFile("uploads/resized/" + req.file.filename, (err, info) => {
      if (err) {
        return res.status(500).send("Error resizing image");
      }
      // Return a response with the path to the resized image
      // return res.send("Resized image path: " + info.path);
    });
  next();
};

export default imageResize;
