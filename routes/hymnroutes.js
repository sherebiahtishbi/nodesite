const express = require('express')
const Author = require('./../models/author')
const Hymn = require('./../models/hymn')
const router = express.Router()                                             

/* hymn routes */
router.get('/', async (req, res) => { 
    console.log('GET /hymns')
    let hymns = await Hymn.find().sort({title:'asc'})
    // hymns = await updatedAuthors(hymns)
    res.render('hymns/hymns', {hymns: hymns, sortorder:'desc'})
})

router.get('/add', async (req, res) => { 
    console.log('GET /hymns/add')
    let authors = await Author.find().sort({name:'asc'})
    res.render('hymns/addhymn', { hymn: new Hymn(), authors: authors })
})

router.get('/edit/:id', async (req, res) => {
    console.log('GET /hymns/edit/:id')
    let hymn = await Hymn.findById(req.params.id)
    let authors = await Author.find().sort({ name: 'asc' })
    // console.log(hymn)
    res.render('hymns/edithymn', { hymn: hymn, authors: authors})
})

router.get('/show/:id', async (req, res) => {
    console.log('GET /hymns/show/:id')
    let hymn = await Hymn.findById(req.params.id)
    let author = await Author.findOne({ name: hymn.author })
    // console.log(author)
    hymn.lastSungDate = Date.now()
    hymn.sungCount = (hymn.sungCount == undefined) ? 1 : hymn.sungCount + 1
    hymn = await hymn.save()
    // console.log(hymn)
    res.render('hymns/showhymn', { hymn: hymn, author: author})
})

router.get('/sort/:key/:order', async (req, res) => { 
    console.log('GET /hymns/sort/:key/:order')
    let sortcolumn = req.params.key
    let sortorder = (req.params.order == undefined) ? 'asc' : req.params.order
    let hymns
    switch (sortcolumn) {
        case 'title':
            hymns = await Hymn.find().sort({ title: sortorder })
            break;
        case 'author':
            hymns = await Hymn.find().sort({ author: sortorder })
            break;
        case 'sungdate':
            hymns = await Hymn.find().sort({ lastSungDate: sortorder })
            break;
        case 'sungcount':
            hymns = await Hymn.find().sort({ sungCount: sortorder })
            break;
        default:
            hymns = await Hymn.find().sort({ title: sortorder })
    }
    if (sortorder == 'desc') {
        sortorder = 'asc'
    } else {
        sortorder = 'desc'
    }
    res.render('hymns/hymns', { hymns: hymns, sortorder: sortorder })
})

router.post('/addhymn', async (req, res, next) => {
    console.log('POST /hymns/addhymn')
    req.hymn = new Hymn()
    next()
}, SaveOrUpdateHymn('addhymn'))

router.put('/edithymn/:id', async (req, res, next) => {
    console.log('PUT /hymns/edithymn/:id')
    req.hymn = await Hymn.findById(req.params.id)
    next()
}, SaveOrUpdateHymn('edithymn'))

function SaveOrUpdateHymn(mode) {
    return async (req, res) => {
        if (mode == undefined || mode == '') return
            console.log('SaveOrUpdateHymn()')
        //intialize hymn data
        let hymn = req.hymn
        hymn.title = req.body.title
        // hymn.author = req.body.author
        let author = await Author.findById(req.body.author)
        // console.log(author)
        hymn.author = author.name
        hymn.refrain = req.body.refrain.trim()
        hymn.stanza1 = req.body.stanza1.trim()
        hymn.stanza2 = req.body.stanza2.trim()
        hymn.stanza3 = req.body.stanza3.trim()
        hymn.stanza4 = req.body.stanza4.trim()
        hymn.stanza5 = req.body.stanza5.trim()
        hymn.stanza6 = req.body.stanza6.trim()
        hymn.stanza7 = req.body.stanza7.trim()
        hymn.stanza8 = req.body.stanza8.trim()
        hymn.stanza9 = req.body.stanza9.trim()
        hymn.stanza10 = req.body.stanza10.trim()

        //try to save
        try {
            hymn = await hymn.save()
            console.log('Hymn saved successfully')
            res.redirect('/hymns')
        } catch (err) {
            console.log(err)
            res.render(`/${mode}`, { author: author })
        }        
    }
}

/* author routes */
router.get('/authors', async (req, res) => { 
    var authors = await Author.find().sort({ name: 'asc'})
    res.render('author/authors', { authors: authors })
})

router.get('/author/add', (req, res) => { 
    console.log('GET: /author/add')
    res.render('author/addauthor', { author: new Author()})
})

router.post('/authoradd', async (req, res, next) => {
    console.log('POST: /authoradd')
    req.author = new Author()
    next()
}, SaveOrUpdateAuthor('addauthor'))

router.put('/authoredit/:id', async (req, res, next) => {
    req.author = await Author.findById(req.params.id)
    console.log('POST: /authoredit')
    next()
}, SaveOrUpdateAuthor('editauthor'))

router.get('/author/edit/:id', async (req, res) => {
    var author = await Author.findById(req.params.id)
    res.render('author/editauthor', {author: author})
})

router.get('/author/showbyname/:name', async (req, res) => {
    if (req.params.name != 'Unknown') {
        var author = await Author.findOne({ name: req.params.name })
        console.log(author)
        res.render('author/authorview', { author: author })
    }
})

router.get('/author/showbyid/:id', async (req, res) => {
    var author = await Author.findById(req.params.id)
    console.log(author)
    res.render('author/authorview', { author: author })
})

function SaveOrUpdateAuthor(mode) {
    return async (req, res) => { 
        let author = req.author
        author.name =  req.body.authorname,
        author.biography= req.body.biography
        try {
            author = await author.save()
            console.log('Author saved successfully')
            res.redirect('/hymns/authors')
        } catch (err) {
            console.log(err)
            res.render(`author/${mode}}`, { author: author })
        }
    }
}

module.exports = router;