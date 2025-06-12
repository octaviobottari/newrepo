const express = require("express")
const env = require("dotenv").config()
const app = express()
const bodyParser = require("body-parser")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const { errorHandler } = require("./utilities/error")
const session = require("express-session")
const pool = require("./database/")
const cookieParser = require("cookie-parser")
const utilities = require("./utilities/")

// Middleware for Sessions and Flash Messages
app.use(session({
    store: new (require('connect-pg-simple')(session))({
        createTableIfMissing: true,
        pool,
        tableName: "session"
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
        sameSite: "strict"
    }
}))
app.use(require('connect-flash')())
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res)
    next()
})

// Cookie Parser Middleware
app.use(cookieParser())
app.use(utilities.checkJWTToken)

// Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// View Engine and Templates
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.use(express.static("public"))

// Routes
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

// Error Handling Middleware
app.use(errorHandler)

// Local Server Information
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

// Log statement to confirm server operation
app.listen(port, () => {
    console.log(`app listening on ${host}:${port}`)
})