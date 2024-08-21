const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { connectToDb } = require("./db/connectToDb.js");
const { File } = require("./models/file.model.js");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads" });

connectToDb();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };
  if (req.body.password !== null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }

  const file = await File.create(fileData);
  res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` });
});

app.get("/file/:id", handleDownload);
app.post("/file/:id", handleDownload);

app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});

async function handleDownload(req, res) {
  const file = await File.findById(req.params.id);

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password");
      return;
    }
    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true });
      return;
    }
  }

  if (!file) {
    console.log("file not present");
    return res.status(400).send("404! File not found");
  }

  file.downloadCount++;
  await file.save();
  console.log("DownloadCount: ", file.downloadCount);

  res.download(file.path, file.originalName);
}
