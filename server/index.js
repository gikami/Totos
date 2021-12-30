require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const https = require('https')
const http = require('http')
const fs = require('fs');
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 5000
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/bizon-food.ru/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/bizon-food.ru/fullchain.pem')
};
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

// Обработка ошибок, последний Middleware
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        //https.createServer(options, app).listen(PORT);
        http.createServer(app).listen(PORT);
    } catch (e) {
        console.log(e)
    }
}


start()
