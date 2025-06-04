const utilities = require("./index")
const { body, validationResult } = require("express-validator")
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
            .withMessage("A valid email is required."),
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
        })
        return
    }
    next()
}

/* ******************************
 * Check login data
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

module.exports = validate