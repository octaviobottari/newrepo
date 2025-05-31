const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    console.log("getClassifications data:", data ? data.rows : "No data returned")
    return data && data.rows ? data.rows : []
  } catch (error) {
    console.error("getClassifications error: " + error)
    return []
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    )
    console.log("getInventoryByClassificationId result:", data ? data.rows : "No data returned")
    return data && data.rows ? data.rows : []
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error)
    return []
  }
}

/* ***************************
 *  Get inventory item by inv_id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.inv_id = $1`,
      [inv_id]
    )
    console.log("getVehicleById result:", data ? data.rows : "No data returned")
    return data && data.rows ? data.rows : []
  } catch (error) {
    console.error("getVehicleById error: " + error)
    return []
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        const result = await pool.query(sql, [classification_name])
        return result.rows[0]
    } catch (error) {
        console.error("addClassification error:", error)
        throw error
    }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
    try {
        const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        const result = await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color])
        return result.rows[0]
    } catch (error) {
        console.error("addInventory error:", error)
        throw error
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory }