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

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById }