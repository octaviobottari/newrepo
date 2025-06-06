const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")

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
async function accountLogin(req, res, next) {
    const { account_email, account_password } = req.body
    try {
        const account = await accountModel.checkAccountEmail(account_email)
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
        const isValid = await bcrypt.compare(account_password, account.account_password)
        if (!isValid) {
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
        delete account.account_password
        const payload = {
            account_id: account.account_id,
            account_email: account.account_email,
            account_type: account.account_type,
            account_firstname: account.account_firstname
        }
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            maxAge: 3600000,
            sameSite: "Strict"
        })
        req.flash("notice", "Login successful!")
        res.redirect("/account/")
    } catch (error) {
        console.error("accountLogin error:", error)
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
        res.clearCookie("jwt")
        req.flash("notice", "You have been logged out.")
        res.redirect("/")
    } catch (error) {
        console.error("processLogout error:", error)
        req.flash("error", "Logout failed. Please try again.")
        res.redirect("/account/")
    }
}

/* ***************************
 * Build account management view
 * ************************** */
async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        layout: "./layouts/layout"
    })
}

/* ***************************
 * Build update view
 * ************************** */
async function buildUpdate(req, res, next) {
    const account_id = parseInt(req.params.account_id)
    if (!res.locals.loggedin || !req.user || req.user.account_id !== account_id) {
        req.flash("error", "Unauthorized access.")
        return res.redirect("/account/login")
    }
    try {
        const account = await accountModel.getAccountById(account_id)
        if (!account) {
            req.flash("error", "Account not found.")
            return res.redirect("/account/")
        }
        let nav = await utilities.getNav()
        res.render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            account_id,
            account_firstname: account.account_firstname,
            account_lastname: account.account_lastname,
            account_email: account.account_email,
            layout: "./layouts/layout"
        })
    } catch (error) {
        console.error("buildUpdate error:", error)
        next(error)
    }
}

/* ***************************
 * Process account update
 * ************************** */
async function processAccountUpdate(req, res, next) {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    const accountId = parseInt(account_id)
    if (!res.locals.loggedin || !req.user || req.user.account_id !== accountId) {
        req.flash("error", "Unauthorized access.")
        return res.redirect("/account/login")
    }
    try {
        const result = await accountModel.updateAccount(accountId, account_firstname, account_lastname, account_email)
        if (result.rowCount > 0) {
            const account = await accountModel.getAccountById(accountId)
            const payload = {
                account_id: account.account_id,
                account_email: account.account_email,
                account_type: account.account_type,
                account_firstname: account.account_firstname
            }
            const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" ? true : false,
                maxAge: 3600000,
                sameSite: "Strict"
            })
            req.flash("notice", "Account updated successfully.")
            res.redirect("/account/")
        } else {
            throw new Error("Update failed")
        }
    } catch (error) {
        console.error("processAccountUpdate error:", error)
        let nav = await utilities.getNav()
        req.flash("error", "Failed to update account. Please try again.")
        res.render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            account_id: accountId,
            account_firstname,
            account_lastname,
            account_email,
            layout: "./layouts/layout"
        })
    }
}

/* ***************************
 * Process password update
 * ************************** */
async function processPasswordUpdate(req, res, next) {
    const { account_id, account_password } = req.body
    const accountId = parseInt(account_id)
    if (!res.locals.loggedin || !req.user || req.user.account_id !== accountId) {
        req.flash("error", "Unauthorized access.")
        return res.redirect("/account/login")
    }
    try {
        const hashedPassword = await bcrypt.hash(account_password, 10)
        const result = await accountModel.updatePassword(accountId, hashedPassword)
        if (result.rowCount > 0) {
            req.flash("notice", "Password updated successfully.")
            res.redirect("/account/")
        } else {
            throw new Error("Password update failed")
        }
    } catch (error) {
        console.error("processPasswordUpdate error:", error)
        let nav = await utilities.getNav()
        req.flash("error", "Failed to update password. Please try again.")
        res.render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            account_id: accountId,
            account_firstname: req.user.account_firstname,
            account_lastname: req.user.account_lastname,
            account_email: req.user.account_email,
            layout: "./layouts/layout"
        })
    }
}

/* ***************************
 * Middleware to check JWT
 * ************************** */
function checkJWT(req, res, next) {
    const token = req.cookies.jwt
    if (!token) {
        req.user = null
        res.locals.loggedin = false
        req.flash("error", "Please log in to access this page.")
        return res.redirect("/account/login")
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        res.locals.loggedin = true
        res.locals.user = decoded
        next()
    } catch (error) {
        console.error("checkJWT error:", error)
        res.clearCookie("jwt")
        req.flash("error", "Session expired or invalid. Please log in again.")
        res.redirect("/account/login")
    }
}

module.exports = { buildLogin, accountLogin, buildRegister, processRegister, processLogout, buildAccountManagement, buildUpdate, processAccountUpdate, processPasswordUpdate, checkJWT }