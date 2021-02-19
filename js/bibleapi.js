const needle = require('needle')

var baseApi = 'http://getbible.net/json?'

module.exports = {
    getScripture: function (passage) {
        return new Promise((resolve, reject) => { 
            let scripture = ''
            if (passage == undefined || passage.length == 0 || passage.book == undefined || passage.book == '') {
                scripture = 'Genesis1:1'
            } else {
                if (passage.chapter == undefined || passage.chapter == '') {
                    scripture = passage.book + '1'
                } else {
                    scripture = passage.book + passage.chapter
                }
                if (passage.fromverse == undefined || passage.fromverse == '' || isNaN(passage.fromverse)) {
                    scripture = scripture + '1'
                } else {
                    scripture = scripture + ':' +passage.fromverse
                }
                if (passage.toverse == undefined || passage.toverse == '' || isNaN(passage.toverse)) {
                    scripture = scripture
                } else {
                    scripture = scripture + '-'+ passage.toverse
                }
            }
            let url = baseApi + 'p='+scripture;
            console.log(url)
            // request(url, (err, res, body) => {
            //     (err) ? reject(err) : resolve(res)
            // })
            var options = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            needle('get', url, options)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    }
}

