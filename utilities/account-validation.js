
const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
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
            .withMessage("Password must be minimum 12 characters, and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.")
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
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

module.exports = validate