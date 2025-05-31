const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const validate = require("../utilities/account-validation")

// Route for login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route for login form submission
router.post("/login", utilities.handleErrors(accountController.processLogin))

// Route for registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route for registration form submission
router.post(
    "/register",
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.processRegister)
)

module.exports = router