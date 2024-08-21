const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const { connectToDb } = require('./db/connectToDb.js');
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

app.post('/upload', upload.single('file'), (req, res) => {
    res.send('hi')
})

app.listen(PORT, () => {
    console.log('server running on port '+PORT)
})