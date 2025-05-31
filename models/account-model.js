const pool = require("../database/")

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
        return result.rowCount > 0
    } catch (error) {
        console.error("Error in registerAccount:", error)
        throw error
    }
}

module.exports = { registerAccount }