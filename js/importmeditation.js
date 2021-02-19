const mongoose = require('mongoose')
const Note = require('./../models/notes')

function importNotes() { 
    $where.getJSON('old-notes.json')
        .then((data) => {
            console.log(data)
        })
        .catch((err) => { 

        })
}


