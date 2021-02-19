const express = require('express')
const config = require('./../resources/config')
const utils = require('./../resources/utils')
const bibleApi = require('./../js/bibleapi')
const needle = require('needle')
const mongoose = require('mongoose')
const Note = require('./../models/notes')
const router = express.Router()      

var baseApi = config.abs.baseUrl

router.get('/', (req, res) => {
    getVersions()
        .then((data) => { 
            res.render('scripture/versions', { versions: data })
        })
        .catch((err) => { 
            res.render('scripture/versions', { Error: err })
        })
})

router.get('/books/:id', (req, res) => {
    let versionid = req.params.id
    getVersions(versionid)
        .then((version) => {
            console.log(version)
            getBooks(versionid)
                .then((books) => { 
                    res.render('scripture/books', { books: books, versiondetail: version })
                })
                .catch((err) => { 
                    console.log('Error >' + err)
                })            
        })
        .catch((err) => { 
            console.log('Error >' + err)
        })
})

router.get('/chapters/:version/:book', (req, res) => {
    let versionid = req.params.version
    let bookid = req.params.book
    getVersions(versionid)
        .then((version) => { 
            getBooks(versionid, bookid, true)
                .then((book) => { 
                    console.log('Book with chapters')
                    res.render('scripture/chapters', { book: book, version: version })
                })
                .catch((err) => { 
                    console.log('GET:/chapters/version/book -> Error getting book>' + err)
                })
        })
        .catch((err) => {
            console.log('GET:/chapters/version/book -> Error getting version>' + err)
        })
})

router.get('/text/:version/:book/:chapter', (req,res) => { 

    let versionid = req.params.version
    let bookid = req.params.book
    let chapterid = req.params.chapter

    getVersions(versionid)
        .then((version) => {
            getBooks(versionid, bookid, false)
                .then((book) => { 
                    getScriptureText(versionid, chapterid)
                        .then((content) => { 
                            // console.log(content)
                            res.render('scripture/scripture', { scripture: content, version: version, book: book, chapterid: chapterid })
                            // res.render('scripture/scripture', { scripture: content.scripture, version: version, book: book, chapterid: chapterid, notes: content.notes })
                        })
                        .catch((err) => {
                            console.log('GET:/text/version/book/chapter -> getScriptureText():error -> ' + err)
                        })
                })
                .catch((err) => { 
                    console.log('GET:/text/version/book/chapter -> getBooks():error -> ' + err)
                })
        })
        .catch((err) => { 
            console.log('GET:/text/version/book/chapter -> getVersion():error -> '+ err)
        })
})

router.get('/getnotes/:version/:book/:chapter/:verse',async (req,res) => {

    let version = req.params.version
    let book = req.params.book
    let chapter = req.params.chapter
    let verse = req.params.verse

    console.log('GET: /notes/:version/:book/:chapter/:verse Error > ')
    console.log('Version > ' + version)
    console.log('Book > ' + book)
    console.log('Chapter > ' + chapter)
    console.log('Verse > ' + verse)

    let note = await Note.find(
        {version: version, book: book, chapter: chapter, verse: verse},
        (err)=>{
            console.log('GET: /notes/:version/:book/:chapter/:verse Error > ' + err)
        })

    res.send({note: note});
})

router.get('/getnotes/:version/:book/:chapter', async (req, res) => {

    let version = req.params.version
    let book = req.params.book
    let chapter = req.params.chapter

    console.log('GET: /notes/:version/:book/:chapter/:verse Error > ')
    console.log('Version > ' + version)
    console.log('Book > ' + book)
    console.log('Chapter > ' + chapter)

    let notes = await Note.find(
        { version: version, book: book, chapter: chapter },
        (err) => {
            console.log('GET: /notes/:version/:book/:chapter Error > ' + err)
        })

    res.send({ notes: notes });
})


router.post('/savenotes/:version/:book/:chapter/:verse',async (req,res) => {

    let version = req.params.version
    let book = req.params.book
    let chapter = req.params.chapter
    let verse = req.params.verse
    let noteTosave = req.body.note

    console.log('POST: /notes/:version/:book/:chapter/:verse Error > ')
    console.log('Version > ' + version)
    console.log('Book > ' + book)
    console.log('Chapter > ' + chapter)
    console.log('Verse > ' + verse)
    console.log('POST data -> note -> ' + noteTosave)

    let note = await Note.findOne(
        {version: version, book: book, chapter: chapter, verse: verse},
        (err)=>{
            console.log('POST: /notes/:version/:book/:chapter/:verse Error > ' + err)
        })
    
    console.log(note)
    
    if (note == null) {
        console.log('POST: /notes/:version/:book/:chapter/:verse > Note didnt exist will create one')
        note = new Note()
        note.version = version
        note.book = book
        note.chapter = chapter
        note.verse = parseInt(verse)
        note.note = noteTosave
    } else {
        console.log('Note before >')
        console.log(note)
        console.log('POST: /notes/:version/:book/:chapter/:verse > Note exists so will update')
        note.note = noteTosave
    }

    // console.log("Let's see what note looks like after update>")
    // console.log(note)
    try { 
        note = await note.save()
        // console.log("And this is how it looks like after update>")
        // console.log(note)
    } catch (err) {
        console.log('POST: /notes/:version/:book/:chapter/:verse > Error adding new note > ' + err)
    }

    res.send({ note: note});
})
module.exports = router


/* Helper functions */

/* fetchs bible version(s) from ABS */
function getVersions(versionid) {
    return new Promise((resolve, reject) => { 
        let url = (versionid == undefined || versionid == '') ? baseApi + config.abs.versionUrl : baseApi + config.abs.versionUrl + '/' + versionid
        console.log(url)
        let fetchOptions = {
            url: url,
            sortkey: 'name',
            sorted: (versionid == undefined || versionid == '') ? true : false
        }

        fetchData(fetchOptions)
            .then((data) => {
                console.log('Total' + data.length + 'Versions available, the first record below >')
                console.log(data[0])
                resolve(data)
            })
            .catch((err) => {
                reject('getVersions:Error > ' + err)
            })
    })
}

/* fetchs book(s) for a given version from ABS */
function getBooks(versionid,bookid,withChapters=false) {
    return new Promise((resolve, reject) => {
        if (versionid == undefined || versionid == '') reject('No versionid, no data')

        let allBookUrl = baseApi + config.abs.bookUrl.replace('{versionid}',versionid)
        let url = (bookid == undefined || bookid == '') ? allBookUrl : allBookUrl + '/' + bookid
        if (withChapters) url += '?include-chapters=true'
        let fetchOptions = {
            url: url,
            sorted: false
        }
        
        fetchData(fetchOptions)
            .then((books) => {
                console.log('Total ' + books.length + 'books available, the first record below >')
                // console.log(books[0])
                console.log(books)
                resolve(books)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/* fetches all the scripture text for a given chapter */
function getScriptureText(version, chapter) {
    return new Promise((resolve,reject) => { 
        if (version == undefined || version == '' || chapter == undefined || chapter == '') reject('Dont know what to fect!')
        let url = baseApi +  config.abs.chapterTextUrl.replace('{versionid}', version).replace('{chapterid}', chapter)

        console.log(url)
        let fetchOptions = {
            url: url,
            sorted: false
        }

        fetchData(fetchOptions)
            .then((scriptureText) => {
                console.log('getScriptureText() > scripture fetched  successfully>')
                console.log(scriptureText)

                // let notes = await Note.find({ version: version, chapter: chapter })
                // let returnObj = { scripture: scriptureText }
                // let returnObj = { scripture: scriptureText, notes: notes }
                resolve(scriptureText)
            })
            .catch((err) => {
                reject(err)
            })        
    })
}

/* Calls the ABS API */ 
function fetchData(fetchOptions) {
    return new Promise((resolve, reject) => { 
        if (fetchOptions == undefined) reject('Missing options!')       
        if (fetchOptions.url == undefined || fetchOptions.url == '') reject('Missing options!')

        let options = {
            headers: {
                "Content-Type": "application/json",
                "api-key": config.abs.api_key
            }
        }

        needle('get', fetchOptions.url, options)
            .then(function (response) {
                let data = response.body.data;

                console.log('fetchData() > ' + fetchOptions.url)
                console.log('fetchData() > ' + data.length)

                if (fetchOptions.sorted) {
                    if (fetchOptions.sortkey == undefined || fetchOptions.sortkey == '') {
                        let sortkey = ''
                    } else {
                        sortkey = fetchOptions.sortkey
                    }

                    if (fetchOptions.sortorder == undefined || fetchOptions.sortorder == '') {
                        sortorder = ''
                    } else {
                        sortorder = fetchOptions.sortorder
                    } 

                    console.log('SORTKEY -> ' + sortkey)
                    utils.sortJSON(data, sortkey, sortorder)
                        .then((data) => {
                            console.log('Data sorted successfully!')
                            resolve(data)
                        })
                        .catch((err) => {
                            console.log('Error sorting data > ' + err)
                            reject('Error: fetching data!')
                        });
                } else {
                    resolve(data)
                }
            })
            .catch(function (error) {
                console.log(error);
            });        
    })
}

