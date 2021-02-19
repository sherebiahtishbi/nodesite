const needle = require('needle')

module.exports = {
    getJSON: function (options) {
        return new Promise((resolve, reject) => { 
            needle('get', options.url, { headers: options.headers } )
                .then(function (response) {
                    let data = response.body;
                    console.log('getJSON() > ' + options.url)
                    // console.log(data)
                    resolve(data)
                })
                .catch(function (error) {
                    reject(error)
                    console.log(error);
                });         
        })
    },

    sortJSON: function (data, sortkey, order) {
        return new Promise((resolve, reject) => {
            if (data == undefined || data.length == 0) reject('Cannot sort empty data')
            if (sortkey == undefined || sortkey == '') sortkey = Object.keys(data[0]);
            if (order == undefined || order == '') order = 'asc'
            
            data.sort((a, b) => {
                // console(a)
                if (a[sortkey] == b[sortkey])
                    return 0;
                if (a[sortkey] < b[sortkey])
                    return (order == 'asc') ? -1 : 1;
                if (a[sortkey] > b[sortkey])
                    return (order == 'asc') ? 1 : -1;
            })

            resolve(data)
        })
    },

    // generic function for MongoDB get operation
    get: function (options) {
    },

    // generic function for MongoDB save operation
    save: function (options) {
    },

    // generic function for MongoDB update operation
    update: function (options) {
    }
}
    
    