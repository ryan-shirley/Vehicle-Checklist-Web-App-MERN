const express = require('express')
const body_parser = require('body-parser')
const app = express()
const port = process.env.PORT || 4000

const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose')
const ATLAS_URI = process.env.ATLAS_URI

const usersRouter = require('./routes/users')
const plantsRouter = require('./routes/plants')
const checkListRouter = require('./routes/checkList')

app.use(body_parser.json())
app.use(cors())

mongoose.connect(ATLAS_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, function(err) {
    if(err) {
        throw err
    }
    else {
        console.log(`Successfully connected to Atlas: MongoDB`);
    }
});

app.get('/', (req, res) => {
    res.json({ message: "You are in the root route."})
})
app.use('/users', usersRouter)
app.use('/plants', plantsRouter)
app.use('/check-lists', checkListRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))