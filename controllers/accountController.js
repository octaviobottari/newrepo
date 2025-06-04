const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const { SECRET } = process.env 

/* ***************************
 * Build login view
 * ************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        layout: "./layouts/layout"
    })
}

/* ***************************
 * Process login
 * ************************** */
async function processLogin(req, res, next) {
    const { account_email, account_password } = req.body
    try {
        const account = await accountModel.verifyAccount(account_email, account_password)
        if (!account) {
            let nav = await utilities.getNav()
            req.flash("error", "Invalid email or password.")
            return res.render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
                layout: "./layouts/layout"
            })
        }
        // Create JWT
        const payload = {
            account_id: account.account_id,
            account_email: account.account_email,
            account_type: account.account_type
        }
        const token = jwt.sign(payload, SECRET, { expiresIn: "1h" })
        // Store JWT in HTTPOnly cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            maxAge: 3600000 
        })
        req.flash("notice", "Login successful!")
        res.redirect("/inv/") 
    } catch (error) {
        console.error("processLogin error:", error)
        req.flash("error", "Login failed. Please try again.")
        let nav = await utilities.getNav()
        res.render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
            layout: "./layouts/layout"
        })
    }
}

/* ***************************
 * Build registration view
 * ************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        layout: "./layouts/layout"
    })
}

/* ***************************
 * Process registration
 * ************************** */
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
                errors: null,
                account_firstname,
                account_lastname,
                account_email,
                layout: "./layouts/layout"
            })
        }
    } catch (error) {
        console.error("processRegister error:", error)
        req.flash("error", "Registration error. Please try again.")
        res.status(501).render("account/register", {
            title: "Register",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            layout: "./layouts/layout"
        })
    }
}

/* ***************************
 * Process logout
 * ************************** */
async function processLogout(req, res, next) {
    try {
        res.clearCookie("jwt") // Destroy JWT cookie
        req.flash("notice", "You have been logged out.")
        res.redirect("/account/login")
    } catch (error) {
        console.error("processLogout error:", error)
        req.flash("error", "Logout failed. Please try again.")
        res.redirect("/inv/")
    }
}

/* ***************************
 * Middleware to check JWT
 * ************************** */
function checkJWT(req, res, next) {
    const token = req.cookies.jwt
    if (!token) {
        req.flash("error", "Please log in to access this page.")
        return res.redirect("/account/login")
    }
    try {
        const decoded = jwt.verify(token, SECRET)
        req.user = decoded // Attach user data to request
        next()
    } catch (error) {
        console.error("checkJWT error:", error)
        res.clearCookie("jwt")
        req.flash("error", "Session expired or invalid. Please log in again.")
        res.redirect("/account/login")
    }
}

module.exports = { buildLogin, processLogin, buildRegister, processRegister, processLogout, checkJWT }