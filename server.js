const express = require (`express`);
const PORT = process.env.PORT || 3001;
const path = require(`path`);
const fs = require(`fs`);
const notes = require (`./db/db.json`)
const app = express()

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// GET route for landing page
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);



// Tell the server to listen for request
app.listen(PORT, () => {
    console.log (`API server now on port ${PORT}!`);
});