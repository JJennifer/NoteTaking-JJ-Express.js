const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json")


const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => 
    res.sendFile(path.join(__dirname, "/public/index.html"))
);

// the /notes is given by the index.js line 7 
app.get("/notes", (req, res) => 
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// /api/notes is given by index.js line 29
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (error, data) => {
        if (error) {
            console.log("There is an error");
        } else {
        const datanotes = JSON.parse(data);
        res.json(datanotes);
        }
    })
});

// grabing user input to store
app.post("/api/notes", (req, res) => {
    // title and text was given in db.json
    const {title, text} = req.body;
    if(title && text){
        const newNote = {
            title,
            text,
        };
    
    // reading notes in system to list them along with new note
    fs.readFile("./db/db.json", "utf8", (error, data)=> {
        if(error){
            console.log("There is an error");
        } else {
            const datanotes = JSON.parse(data);
            datanotes.push(newNote);
            // listing the new note
            fs.writeFile("./db/db.json", JSON.stringify(datanotes), (error) => {
                if(error){
                    console.log("There is an error");
                } else {
                    console.log("Your new note posted");
                };
            });
            
        };
    });

    const response = {
        status: "success",
        body: newNote,
      };
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json("Error in posting note");
  };
});



app.listen(PORT, () =>
  console.log(`http://localhost:${PORT}`)
);