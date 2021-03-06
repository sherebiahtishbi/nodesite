const express = require('express')
const config = require('./../resources/config')
const utils = require('./../resources/utils')
const router = express.Router()

router.get('/', (req, res) => {
    getData()
        .then((data) => {
            res.render('audio/audiosermons', { speakers: data[0], topics: data[1], scriptures: data[2], activetab: 'speaker', alphabet: 'A' })
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/:letter/:activetab', (req, res) => {
    let letter = req.params.letter
    let activetab = (req.params.activetab == undefined) ? 'speaker' : req.params.activetab
    getData(letter)
        .then((data) => {
            // console.log(data)
            console.log("Will render data now!")
            res.render('audio/audiosermons', { speakers: data[0], topics: data[1], scriptures: data[2], activetab: activetab, alphabet: letter })
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/sermons/:type/:jsonurl/:letter', (req, res) => {
    let jsonurl = req.params.jsonurl
    let type = req.params.type
    let letter = req.params.letter
    let url = '/' + type + '/' + jsonurl + '.json'
    console.log('URL > ', url)
    getSermons(url)
        .then((sermons) => {
            console.log("Will render data now!")
            res.render('audio/sermonlist', { sermons: sermons, type: type, alphabet: letter })
        })
        .catch((err) => {
            console.log(err)
        })
})

module.exports = router

function getData(letter = 'A') {
    return new Promise((resolve, reject) => {
        //call all 3 APIs in parallel with multi promise handler to save time
        Promise.all([getSpeakers(letter), getTopics(letter), getScriptures(letter)]).then((data) => {
            console.log('>>> All promises are done')
            resolve(data)
        }).catch(err => {
            console.log('Error occurred >')
            console.log(err)
            reject(err)
        })
    })
}

function getSpeakers(letter = 'A') {
    return new Promise((resolve, reject) => {
        let fetchOptions = {
            url: config.sermonindex.speakersApi,
            headers: {
                "Content-Type": "application/json"
            }
        }
        console.log(fetchOptions)

        utils.getJSON(fetchOptions)
            .then((speakers) => {
                console.log('Speakers fetched from sermonindex successfully!')
                console.log(speakers.length)
                filteredData(speakers, 'speaker', letter)
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

function getTopics(letter = 'A') {
    return new Promise((resolve, reject) => {
        let fetchOptions = {
            url: config.sermonindex.topicsApi,
            headers: {
                "Content-Type": "application/json"
            }
        }
        console.log(fetchOptions)

        utils.getJSON(fetchOptions)
            .then((topics) => {
                console.log('Topics fetched from sermonindex successfully!')
                filteredData(topics, 'topic', letter)
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

function getScriptures(letter = 'A') {
    return new Promise((resolve, reject) => {
        let fetchOptions = {
            url: config.sermonindex.scriptureApi,
            headers: {
                "Content-Type": "application/json"
            }
        }
        console.log(fetchOptions)

        utils.getJSON(fetchOptions)
            .then((scriptures) => {
                console.log('Scriptures fetched from sermonindex successfully!')
                filteredData(scriptures, 'scripture', letter)
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


function filteredData(data, type, letter = 'A') {
    return new Promise((resolve, reject) => {
        console.log('filteredData()')
        if (data == undefined || data.length == 0) reject('nodata')
        let postFilterData = []
        for (var item in data) {
            let name = formattedSpeakerName(item)
            if (type == 'scripture') {
                postFilterData.push({ 'name': name, 'url': data[item] })
            } else {
                if (item.substring(0, 1).toUpperCase() == letter) {
                    postFilterData.push({ 'name': name, 'url': data[item] })
                }
            }
        }
        resolve(postFilterData)
    })
}

function formattedSpeakerName(name) {
    var formattedName = '', wordArray;
    wordArray = name.split('_');
    for (var index = 0; index < wordArray.length; index++) {
        formattedName += wordArray[index][0].toUpperCase() + wordArray[index].slice(1) + ' ';
    }
    return formattedName;
}

function getSermons(url) {
    return new Promise((resolve, reject) => {
        if (url == undefined) reject('nodata')
        let fetchOptions = {
            url: config.sermonindex.baseApi + url,
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