const express = require('express')
const body_parser = require('body-parser')
const app = express()
const port = process.env.PORT || 4000

const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose')
const ATLAS_URI = process.env.ATLAS_URI

const rootRouter = require('./routes/root')
const usersRouter = require('./routes/users')
const plantsRouter = require('./routes/plants')
const checkListRouter = require('./routes/checkList')
const recordsRouter = require('./routes/records')

app.use(body_parser.json())
app.use(cors())

mongoose.connect(ATLAS_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, 'useFindAndModify': false}, function(err) {
    if(err) {
        throw err
    }
    else {
        console.log(`Successfully connected to Atlas: MongoDB`);
    }
});

app.use('/', rootRouter)
app.use('/users', usersRouter)
app.use('/plants', plantsRouter)
app.use('/check-lists', checkListRouter)
app.use('/records', recordsRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))