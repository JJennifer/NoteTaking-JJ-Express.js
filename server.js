const express = require("express");
const path = require('path');
const fs = require("fs");
const db = require("./db/db.json")

const PORT = process.env.Port || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});


app.get("./api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (error, data) => {
        if (error) {
            console.log("There is an error");
        } else {
        const datanotes = JSON.parse(data);
        res.json(datanotes);
        }
    })
});

app.post("/api/notes", (req, res) => {
    const {title, text} = req.body;
    if(title && text){
        const newNote = {
            title,
            text,
        };
    };
    fs.readFile("./db/db.json", "utf8", (error, data)=> {
        if(error){
            console.log("There is an error");
        } else {
            const datanotes = JSON.parse(data);
            datanotes.push(newNote);
            
            fs.writeFile("./db/db.json", JSON.stringify(datanotes), (error) => {
                if(error){
                    console.log("There is an error");
                } else {
                    console.log("Your new note posted");
                };
            });
            
        };
    });
});


app.listen(PORT, () =>
  console.log(`http://localhost:${PORT}`)
);