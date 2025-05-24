const express = require("express")
const env = require("dotenv").config()
const app = express()
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const { errorHandler } = require("./utilities/error")

// View Engine and Templates
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.use(express.static("public"))

// Routes
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)

// Error Handling Middleware
app.use(errorHandler)

// Local Server Information
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

// Log statement to confirm server operation
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})