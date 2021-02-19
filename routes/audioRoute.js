const express = require('express')
const config = require('./../resources/config')
const utils = require('./../resources/utils')
const router = express.Router()

router.get('/', (req, res) => {
    getSpeakers()
        .then((speakers) => { 
            // console.log(data)
            console.log("Will render data now!")
            res.render('audio/speakerlist', {speakers: speakers})
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/speakers/:letter', (req, res) => {
    let letter = req.params.letter
    getSpeakers(letter)
        .then((speakers) => {
            // console.log(data)
            console.log("Will render data now!")
            res.render('audio/speakerlist', { speakers: speakers })
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/sermons/:speaker', (req, res) => {
    let speaker = req.params.speaker
    getSermons(speaker)
        .then((sermons) => {
            // console.log(sermons.sermons[0])
            console.log("Will render data now!")
            res.render('audio/sermonlist', { sermons: sermons })
        })
        .catch((err) => {
            console.log(err)
        })
})

module.exports = router

function getSpeakers(letter='A') {
    return new Promise((resolve, reject) => { 
        let fetchOptions = {
            url: config.sermonindex.speakersApi,
            headers: { 
                "Content-Type" :"application/json"
             }
        }
        console.log(fetchOptions)

        utils.getJSON(fetchOptions)
            .then((speakers) => { 
                console.log('Speakers fetched from sermonindex successfully!')
                filterSpeakers(speakers, letter)
                    .then((data) => { 
                        resolve(data)
                    })
                    .catch((err) => { 
                        console.log(err)
                    })
            })
            .catch((err) => { 
                console.log(err)
                reject(err)
            })
    })
}

function filterSpeakers(speakers,letter = 'A') {
    return new Promise((resolve, reject) => { 
        console.log('filterSpeakers()')
        // console.log(speakers)
        if (speakers == undefined || speakers.length == 0) reject('nodata')
        let spkObj = []
        for (speaker in speakers) {
            // console.log(speaker)
            if (speaker.substring(0, 1).toUpperCase() == letter) {
                // console.log(speakers[speaker])
                let name = formattedSpeakerName(speaker)
                // console.log(name)
                spkObj.push({ 'name': name, 'url': speakers[speaker]})
            }
        }
        // console.log(spkObj)
        resolve(spkObj)
    })
}

function formattedSpeakerName(name) {
    var speakername = '', speakerarray;
    speakerarray = name.split('_');
    for (index = 0; index < speakerarray.length; index++) {
        speakername += speakerarray[index][0].toUpperCase() + speakerarray[index].slice(1) + ' ';
    }
    return speakername;
}

function getSermons(speaker) {
    return new Promise((resolve, reject) => { 
        if (speaker == undefined) reject('nodata')
        let fetchOptions = {
            url: config.sermonindex.baseApi + speaker,
            headers: {
                "Content-Type": "application/json"
            }
        }
        console.log(fetchOptions)

        utils.getJSON(fetchOptions)
            .then((sermons) => {
                console.log('Sermons fetched from sermonindex successfully!')
                // console.log(sermons)
                resolve(sermons)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            })        
    })
}