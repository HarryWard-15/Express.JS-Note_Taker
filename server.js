const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.delete('/api/notes/:id', (req, res) => {
    let listOfNotesDel = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    const noteId = req.params.id;

    listOfNotesDel = listOfNotesDel.filter(noteSelected => {
        return noteSelected.id != noteId;
    });

    fs.writeFileSync("./db/db.json", JSON.stringify(listOfNotesDel));
    res.json(listOfNotesDel);
});

app.post('/api/notes', (req, res) => {
    const note = req.body;
    const notesArray = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    const lengthNote = notesArray.length;

    note.id = lengthNote;
    note.content = note;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    res.json(notesArray);
});

app.listen(PORT, () => console.log('Server is hosted on PORT: '+`http://localhost:${PORT}!`));

