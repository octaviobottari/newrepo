const pool = require("../database/")
const bcrypt = require("bcryptjs")

/* ***************************
 * Register new account
 * ************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const hashedPassword = await bcrypt.hash(account_password, 10)
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, $5) RETURNING *"
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword, "Client"])
        return result.rows[0]
    } catch (error) {
        console.error("registerAccount error:", error)
        throw error
    }
}

/* ***************************
 * Verify account credentials
 * ************************** */
async function verifyAccount(account_email, account_password) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const result = await pool.query(sql, [account_email])
        if (result.rows.length === 0) {
            return null
        }
        const account = result.rows[0]
        const isValid = await bcrypt.compare(account_password, account.account_password)
        return isValid ? account : null
    } catch (error) {
        console.error("verifyAccount error:", error)
        throw error
    }
}

module.exports = { registerAccount, verifyAccount }