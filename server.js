const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { connectToDb } = require('./db/connectToDb.js');
const { File } = require('./models/file.model.js');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads'});

connectToDb();

app.use(express.static('public'));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render("index");
});

app.post('/upload', upload.single('file'), async (req, res) => {
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname
    }
    if (req.body.password !== null && req.body.password !== "") {
        fileData.password = await bcrypt.hash(req.body.password, 10);
    }

    const file = await File.create(fileData);
    console.log(file)
    res.send(file.originalName)
})

app.listen(PORT, () => {
    console.log('server running on port '+PORT)
})