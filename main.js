const express = require('express')
const mongo = require('mongoose')
const methodOverride = require('method-override')
const config = require('./resources/config')

/* Initialize App */
const app = express()
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

/* MongoDB connection */
mongo.connect(config.connectionstring, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('MongoDB connected successfully!')
    })
    .catch((err) => {
        console.log('Error connecting MongoDB')
        console.log(err)
    })

/* Templates */
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Routes */
const homeRouter = require('./routes/home')
const hymnRouter = require('./routes/hymnroutes')
const bibleRouter = require('./routes/scripture')
const appSettingRouter = require('./routes/appsettingsroute')
const meditationRouter = require('./routes/meditationRoute')
const audioRouter = require('./routes/audioRoute')
const articleRouter = require('./routes/articleroute')
const logRouter = require('./routes/logRoute')
const credRouter = require('./routes/credroute')
const paymethodRouter = require('./routes/paymethodroute')
const billpayRouter = require('./routes/billpayRoute')
const vendorRouter = require('./routes/vendorRoute')
const expenseCategoryRouter = require('./routes/expensecategoryroute')
const expenseRouter = require('./routes/expenseroute')
const incomeRouter = require('./routes/incomeRoute')
// const wifireportRouter = require('./routes/wifireportRoute')

app.use('/', homeRouter)
app.use('/hymns', hymnRouter)
app.use('/bible', bibleRouter)
app.use('/appsettings', appSettingRouter)
app.use('/meditation', meditationRouter)
app.use('/audio', audioRouter)
app.use('/articles', articleRouter)
app.use('/logs', logRouter)
app.use('/creds', credRouter)
app.use('/finance/paymentmethod', paymethodRouter)
app.use('/finance/billpay', billpayRouter)
app.use('/finance/vendor', vendorRouter)
app.use('/finance/expense/category', expenseCategoryRouter)
app.use('/finance/expense', expenseRouter)
app.use('/finance/income', incomeRouter)
// app.use('/wifireport', wifireportRouter)

app.get('/', (req, res) => {
    var clientip = req.connection.remoteAddress.substring(7)
    console.log(clientip)
    if (config.superusers.includes(clientip)) {
        res.render('index')
    } else {
        res.render('index')
    }
})


/* App */
app.listen(config.serverPort, () => {
    console.log('Server started and listening on port [' + config.serverPort + ']')
})
