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

app.delete('/api/notes', (req, res) => {
    const listOfNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    const noteNum = (req.params.num);

    listOfNotes = listOfNotes.filter(note => {
        return note.num != noteNum;
    });

    fs.writeFileSync("./db/db.json", JSON.stringify(listOfNotes));
    res.json(listOfNotes);
});

app.post('/api/notes', (req, res) => {
    const note = req.body;
    const listOfNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    const lengthNote = listOfNotes.length;

    note.num = lengthNote;
    listOfNotes.push(note);

    fs.writeFileSync("./db/db.json", JSON.stringify(listOfNotes));
    res.json(listOfNotes);
});

app.listen(PORT, () => console.log('Server is hosted on PORT: ' + PORT));

