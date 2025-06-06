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
    validate.loginRules(),
    validate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
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

// Route for account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Route to build update view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdate))

// Route to process account update
router.post(
    "/update/:account_id",
    utilities.checkLogin,
    validate.accountUpdateRules(),
    validate.checkAccountUpdateData,
    utilities.handleErrors(accountController.processAccountUpdate)
)

// Route to process password update
router.post(
    "/update-password/:account_id",
    utilities.checkLogin,
    validate.passwordUpdateRules(),
    validate.checkPasswordUpdateData,
    utilities.handleErrors(accountController.processPasswordUpdate)
)

module.exports = router