// const iputil = require('internal-ip')

module.exports = {
    // connectionstring:"mongodb+srv://sherebiahtishbi:Sher$Family$2020@cluster0-w5mxr.gcp.mongodb.net/test?retryWrites=true&w=majority"
    connectionstring: "mongodb://192.168.0.17/familysite",
    serverPort: 8000,
    abs: {
        api_key: '0b8ffb772bd281154249b8b878bf0619',
        baseUrl: 'https://api.scripture.api.bible/v1',
        versionUrl: '/bibles',
        bookUrl: '/bibles/{versionid}/books',
        chapterUrl: '/bibles/{versionid}/books/{bookid}/chapters',
        chapterTextUrl: '/bibles/{versionid}/chapters/{chapterid}',
    },
    sermonindex: {
        baseApi: "https://api.sermonindex.net/audio/speaker/",
        speakersApi: "https://api.sermonindex.net/audio/speaker/_sermonindex.json"
    },
    months: [
        { monthno: 1, monthname: 'Jan' },
        { monthno: 2, monthname: 'Feb' },
        { monthno: 3, monthname: 'Mar' },
        { monthno: 4, monthname: 'Apr' },
        { monthno: 5, monthname: 'May' },
        { monthno: 6, monthname: 'Jun' },
        { monthno: 7, monthname: 'Jul' },
        { monthno: 8, monthname: 'Aug' },
        { monthno: 9, monthname: 'Sep' },
        { monthno: 10, monthname: 'Oct' },
        { monthno: 11, monthname: 'Nov' },
        { monthno: 12, monthname: 'Dec' },
    ],
    // years: [2021,2020,2019,2018],
    years: [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010],
    // superusers: ['192.168.0.17', '192.168.0.14', '192.168.0.13'],
    superusers: ['192.168.0.17', '192.168.0.15', '192.168.0.14', '192.168.0.13', '192.168.0.21'],
    usermap: {
        '192.168.0.10': 'Otsuka Laptop',
        '192.168.0.11': 'Chromecast',
        '192.168.0.12': 'iPhone-Shine',
        '192.168.0.13': 'iPhone-Yarusha',
        '192.168.0.14': 'Galaxy Tab',
        '192.168.0.15': 'iPhone-Sherebiah',
        '192.168.0.17': 'DellDesktop-Sherebiah',
        '192.168.0.18': 'WindowLaptop-Anu',
        '192.168.0.20': 'iPhone-Krupa',
        '192.168.0.21': 'HP Laptop-Yarusha',
        '192.168.0.22': 'MacBook-Shine',
        '192.168.0.23': 'iPhone-Anu',
        '192.168.0.26': 'iPad-Krupa'
    }
}
