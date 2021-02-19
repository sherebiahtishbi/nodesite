const config = require('./../resources/config')
const request = require('request')
const axios = require('axios')

exports.getQuery = async function (date1, date2) {
    return new Promise((resolve, reject) => {
        let query = {}
        console.log(date1)

        try {

            // Today
            if (date1 == 'today') {
                let daterange = {
                    startdate: new Date(new Date().setHours(00, 00, 00)),
                    enddate: new Date(new Date().setHours(23, 59, 59))
                }
                console.log(daterange)
                resolve(daterange)
            }

            // Yesterday
            if (date1 == 'yday') {
                let ydt = new Date()
                ydt = new Date(ydt.getFullYear(), ydt.getMonth(), ydt.getDate() - 1)
                let daterange = {
                    startdate: new Date(ydt.setHours(00, 00, 00)),
                    enddate: new Date(ydt.setHours(23, 59, 59))
                }
                console.log(daterange)
                resolve(daterange)
            }

            // Past 7 days
            if (date1 == 'past7days') {
                this.getSecondDate(new Date(), 7)
                    .then((dt2) => {
                        let daterange = {
                            startdate: new Date(dt2.setHours(00, 00, 00)),
                            enddate: new Date(new Date().setHours(23, 59, 59))
                        }
                        console.log(daterange)
                        resolve(daterange)
                    })
                    .catch((err) => {
                        console.log(err)
                        reject(err)
                    })
            }

            //This month
            if (date1 == 'thismonth') {
                let dt1 = new Date()
                this.getThisMonthDates()
                    .then((dates) => {
                        let daterange = {
                            startdate: new Date(dates.startDate.setHours(00, 00, 00)),
                            enddate: new Date(dates.endDate.setHours(23, 59, 59))
                        }
                        console.log(daterange)
                        resolve(daterange)
                    })
                    .catch((err) => {
                        console.log(err)
                        reject(err)
                    })
            }

            // Last month
            if (date1 == 'lastmonth') {
                let dt1 = new Date()
                this.getLastMonthDates()
                    .then((dates) => {
                        let daterange = {
                            startdate: new Date(dates.startDate.setHours(00, 00, 00)),
                            enddate: new Date(dates.endDate.setHours(23, 59, 59))
                        }
                        console.log(daterange)
                        resolve(daterange)
                    })
                    .catch((err) => {
                        console.log(err)
                        reject(err)
                    })
            }

            // This year
            if (date1 == 'thisyear') {
                this.getThisYearDates()
                    .then((dates) => {
                        let daterange = {
                            startdate: new Date(dates.startDate.setHours(00, 00, 00)),
                            enddate: new Date(dates.endDate.setHours(23, 59, 59))
                        }
                        console.log(daterange)
                        resolve(daterange)
                    })
                    .catch((err) => {
                        console.log(err)
                        reject(err)
                    })
            }

            // Last year
            if (date1 == 'lastyear') {
                this.getLastYearDates()
                    .then((dates) => {
                        let daterange = {
                            startdate: dates.startDate.setHours(00, 00, 00),
                            enddate: dates.endDate.setHours(23, 59, 59)
                        }
                        console.log(daterange)
                        resolve(daterange)
                    })
                    .catch((err) => {
                        console.log(err)
                        reject(err)
                    })
            }

            if (date1 != undefined && date2 != undefined) {
                console.log('Custom Date raneg!')
                console.log(date1)
                console.log(date2)
                try {
                    let daterange = {
                        startdate: new Date(new Date(date1).setHours(00, 00, 00)),
                        enddate: new Date(new Date(date2).setHours(23, 59, 59))
                    }
                    console.log(daterange)
                    resolve(daterange)
                } catch (err) {
                    console.log(err)
                    reject(err)
                }
            }

        } catch (err) {
            console.log('ERROR creating date query > ' + err)
            reject(err)
        }
    })
};

// calculates the second date for options like yday, past 7 days
exports.getSecondDate = async function (dt, daysToDeduct) {
    return new Promise((resolve, reject) => {
        console.log('preparing 2nd date')
        let dt2 = new Date()
        try {
            if (dt.getDate() > daysToDeduct) {
                console.log('Day is greater than 7')
                dt2 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - daysToDeduct)
            } else {
                let daysToDeductFromLastMonth = daysToDeduct - dt.getDate()
                dt2 = new Date(dt.getFullYear(), dt.getMonth() - 1, dt.getDate() - daysToDeductFromLastMonth)
            }
            resolve(dt2)
        } catch (err) {
            console.log('ERROR getting 2nd date > ' + err)
            reject(err)
        }
    })
};

// returns the date range of current month till today
exports.getThisMonthDates = async function () {
    return new Promise((resolve, reject) => {
        console.log('preparing current month dates')
        let startDate = endDate = new Date()

        try {
            startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
            console.log(startDate)
        } catch (err) {
            console.log(err)
            reject(err)
        }
        let dates = { startDate: startDate, endDate: endDate }
        resolve(dates)
    })
};

// returns the begin and end date of last month
exports.getLastMonthDates = async function () {
    return new Promise((resolve, reject) => {
        console.log('preparing last month dates')
        let startDate = endDate = new Date()
        let dt = new Date()
        try {
            startDate = new Date(dt.getFullYear(), dt.getMonth() - 1, 1)
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
        } catch (err) {
            console.log(err)
            reject(err)
        }
        let dates = { startDate: startDate, endDate: endDate }

        resolve(dates)
    })
};

// returns the date range from begining of the month till today
exports.getThisYearDates = async function () {
    return new Promise((resolve, reject) => {
        console.log('preparing this year dates')
        let startDate = endDate = new Date()
        let dt = new Date()
        try {
            startDate = new Date(startDate.getFullYear(), 0, 1)
        } catch (err) {
            console.log(err)
            reject(err)
        }
        let dates = { startDate: startDate, endDate: endDate }
        console.log('this year dates')
        console.log(dates)

        resolve(dates)
    })
};

// returns the begin and end date of last year
exports.getLastYearDates = async function () {
    return new Promise((resolve, reject) => {
        console.log('preparing last year dates')
        let startDate = endDate = new Date()
        try {
            startDate = new Date(startDate.getFullYear() - 1, 0, 1)
            endDate = new Date(endDate.getFullYear() - 1, 11, 31)
        } catch (err) {
            console.log(err)
            reject(err)
        }
        let dates = { startDate: startDate, endDate: endDate }
        console.log('last year dates')
        console.log(dates)

        resolve(dates)
    })
};

//Checks user authorization 
exports.isAuthorizedDevice = function (clientip, module) {
    clientip = clientip.substring(7)
    console.log('Client IP > ' + clientip)
    if (config.superusers.includes(clientip)) {
        console.log('Allowed Client :' + clientip + ', Module :' + module)
        this.updateAccessLog(clientip, module)
        return 'Authorized'
    } else {
        console.log('Unauthorized device : ' + clientip)
        return 'Unauthorized'
    }
};

//Updates the access Log
exports.updateAccessLog = function (clientip, module) {
    console.log('Saving log entry')

    try {
        axios({
            method: 'post',
            url: 'http://192.168.0.17:3000/logs/save',
            data: {
                page: module,
                client: clientip
            }
        }).then((res) => {
            // console.log(res)
        }).catch((err) => {
            // console.log(err)
        })
    } catch (err) {
        console.log('Error : failed to update access log')
        console.log(err)
    }

    return true
};