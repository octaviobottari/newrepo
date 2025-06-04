const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const validate = require("../utilities/account-validation")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to process login
router.post(
    "/login",
    validate.loginRules(), // Add login validation rules
    validate.checkLoginData,
    utilities.handleErrors(accountController.processLogin)
)

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration data
router.post(
    "/register",
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.processRegister)
)

// Route to process logout
router.get("/logout", utilities.handleErrors(accountController.processLogout))

module.exports = router