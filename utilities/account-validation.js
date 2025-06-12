const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/* **********************************
 * Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
        body("account_firstname")
            .trim()
        .isLength({ min: 1 })
            .withMessage("Please provide a first name."),
        body("account_lastname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a last name."),
        body("account_email")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide an email.")
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const account = await accountModel.checkAccountEmail(account_email)
                if (account) {
                    throw new Error("Email already exists.")
                }
                return true
            }),
        body("account_password")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a password.")
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password must be minimum 12 characters, and must include at least one uppercase letter, one lowercase letter, one number, and one special character.")
    ]
}

/* **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide an email.")
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),
        body("account_password")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a password.")
    ]
}

/* **********************************
 * Account Update Validation Rules
 * ********************************* */
validate.accountUpdateRules = () => {
    return [
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),
        body("account_lastname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a last name."),
        body("account_email")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide an email.")
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const account = await accountModel.checkAccountEmail(account_email)
                if (account && account.account_id !== parseInt(req.body.account_id)) {
                    throw new Error("Email already exists.")
                }
                return true
            }),
        body("account_id")
            .isInt()
            .withMessage("Invalid account ID.")
    ]
}

/* **********************************
 * Password Update Validation Rules
 * ********************************* */
validate.passwordUpdateRules = () => {
    return [
        body("account_password")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a password.")
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password must be minimum 12 characters, and must include at least one uppercase letter, one lowercase letter, one number, and one special character."),
        body("account_id")
            .isInt()
            .withMessage("Invalid account ID.")
    ]
}

/* ******************************
 * Check registration data
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            layout: "./layouts/layout"
        })
        return
    }
    next()
}

/* ******************************
 * Check login data
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email, account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array())
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
            layout: "./layouts/layout"
        })
        return
    }
    console.log("Login validation passed for:", account_email)
    next()
}

/* ******************************
 * Check account update data
 * ***************************** */
validate.checkAccountUpdateData = async (req, res, next) => {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_id,
            account_firstname,
            account_lastname,
            account_email,
            layout: "./layouts/layout"
        })
        return
    }
    next()
}

/* ******************************
 * Check password update data
 * ***************************** */
validate.checkPasswordUpdateData = async (req, res, next) => {
    const { account_id, account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_id,
            account_firstname: req.user.account_firstname,
            account_lastname: req.user.account_lastname,
            account_email: req.user.account_email,
            layout: "./layouts/layout"
        })
        return
    }
    next()
}

module.exports = validate