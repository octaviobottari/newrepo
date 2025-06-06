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
 * Check account by email
 * ************************** */
async function checkAccountEmail(account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const result = await pool.query(sql, [account_email])
        return result.rows[0] || null
    } catch (error) {
        console.error("checkAccountEmail error:", error)
        throw error
    }
}

/* ***************************
 * Get account by ID
 * ************************** */
async function getAccountById(account_id) {
    try {
        const sql = "SELECT * FROM account WHERE account_id = $1"
        const result = await pool.query(sql, [account_id])
        return result.rows[0] || null
    } catch (error) {
        console.error("getAccountById error:", error)
        throw error
    }
}

/* ***************************
 * Update account information
 * ************************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
    try {
        const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
        return result
    } catch (error) {
        console.error("updateAccount error:", error)
        throw error
    }
}

/* ***************************
 * Update account password
 * ************************** */
async function updatePassword(account_id, hashedPassword) {
    try {
        const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        const result = await pool.query(sql, [hashedPassword, account_id])
        return result
    } catch (error) {
        console.error("updatePassword error:", error)
        throw error
    }
}

module.exports = { registerAccount, checkAccountEmail, getAccountById, updateAccount, updatePassword }