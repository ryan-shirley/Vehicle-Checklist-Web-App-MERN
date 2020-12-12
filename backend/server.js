const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const express = require('express')
const body_parser = require('body-parser')
const app = express()
const port = process.env.PORT || 4000

const cors = require('cors')
require('dotenv').config()

// Routes
const rootRouter = require('./routes/root')
const usersRouter = require('./routes/users')
const plantsRouter = require('./routes/plants')
const checkListRouter = require('./routes/checkList')
const recordsRouter = require('./routes/records')

// Sentry Config
Sentry.init({ 
    dsn: process.env.SENTRY_DSN,
    integrations: [
        // enable HTTP calls tracing
        // new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ 
            // to trace all requests to the default router
            // app, 
            // alternatively, you can specify the routes you want to trace:
            router: [
                rootRouter, usersRouter, plantsRouter, checkListRouter, recordsRouter
            ], 
        }),
        new Tracing.Integrations.Mongo(),
    ],
    environment: process.env.NODE_ENV,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
})
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

const mongoose = require('mongoose')
const ATLAS_URI = process.env.ATLAS_URI

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

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});  

app.listen(port, () => console.log(`Example app listening on port ${port}!`))