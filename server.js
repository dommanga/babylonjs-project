const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fbx2gltf = require("fbx2gltf");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
const port = 3000;

const upload = multer({ dest: "uploads/" });

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "public")));

app.post("/upload", upload.single("file"), (req, res) => {
  const fbxFilePath = req.file.path;
  const glbFilePath = path.join(
    __dirname,
    "uploads",
    req.file.filename + ".glb"
  );
  console.log("Received file:", fbxFilePath);

  fbx2gltf(fbxFilePath, glbFilePath, ["--binary"])
    .then(() => {
      console.log("File converted successfully:", glbFilePath);
      fs.unlinkSync(fbxFilePath); // Remove the original FBX file
      res.json({ filePath: `/uploads/${req.file.filename}.glb` });
    })
    .catch((err) => {
      console.error("Error converting file:", err);
      res.status(500).send("Error converting file");
    });
});

app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  console.log("Serving file:", filePath);
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
