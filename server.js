const express = require (`express`);
const PORT = process.env.PORT || 3001;
const path = require(`path`);
const fs = require(`fs`);
const notes = require (`./db/db.json`)
const app = express()
const uuid = require('uuid');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// GET request for notes
app.get('/api/notes', (req, res) => {
    // Send json 
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    })
});

// POST request for notes
app.post(`/api/notes`, (req, res) => {
   
    const {title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid.v4()
        }

        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote)
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) => {
                    err ? console.log(err) : console.log('successfully added note')
                })
            }
        })

        const response = {
            status: 'success',
            body: newNote
        }

        console.log(response);
        res.json(response);
    } else {
        res.json('unable to post note')
    }

   });

//DELETE request for notes
app.delete('/api/notes/:id', (req, res) => {

    const id = req.params.id;
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        const parsedNotes = JSON.parse(data);
        const updatedNotes = parsedNotes.filter((note) => note.id !== id);

    fs.writeFile('./db/db.json', JSON.stringify(updatedNotes, null, 4), (err) => {
         err ? console.log(err) : console.log('successfully deleted note')
    })
        res.json(`Note with id ${id} deleted`);
    })
})

// GET route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route for landing page
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Tell the server to listen for request
app.listen(PORT, () => {
    console.log (`API server now on port ${PORT}!`);
});