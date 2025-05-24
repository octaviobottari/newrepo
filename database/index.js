const { Pool } = require("pg")
require("dotenv").config()

/* ***************
 * Connection Pool
 * Configured for both development and production
 * Uses SSL with rejectUnauthorized: false for Render.com compatibility
 * Exports a query method for compatibility with inventory-model.js
 * *************** */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}