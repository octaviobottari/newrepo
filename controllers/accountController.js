const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")

/* 
 * Deliver login view
 */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        layout: "./layouts/layout"
    })
}

/* 
 * Process login form submission
 */
async function processLogin(req, res, next) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    req.flash("notice", "Login attempt received. Processing not implemented yet.")
    res.redirect("/")
}

/* 
 * Deliver registration view
 */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        layout: "./layouts/layout"
    })
}

async function processRegister(req, res, next) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    try {
        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            account_password
        )
        if (regResult) {
            req.flash("notice", `Congratulations, you're registered ${account_firstname}! Please log in.`)
            res.redirect("/account/login")
        } else {
            req.flash("error", "Sorry, the registration failed. Please try again.")
            res.status(501).render("account/register", {
                title: "Register",
                nav,
                layout: "./layouts/layout"
            })
        }
    } catch (error) {
        req.flash("error", "Registration error. Please try again.")
        res.status(501).render("account/register", {
            title: "Register",
            nav,
            layout: "./layouts/layout"
        })
    }
}

module.exports = { buildLogin, processLogin, buildRegister, processRegister }