const pool = require("../database/")

const inventoryModel = {}

/* ***************************
 * Get all classification data
 * ************************** */
inventoryModel.getClassifications = async function () {
    try {
        const data = await pool.query(
            "SELECT * FROM public.classification ORDER BY classification_name"
        )
        console.log("getClassifications data:", data ? data.rows : "No data returned")
        return data && data.rows ? data.rows : []
    } catch (error) {
        console.error("getClassifications error:", error.stack)
        return []
    }
}

/* ***************************
 * Get all inventory items and classification_name by classification_id
 * ************************** */
inventoryModel.getInventoryByClassificationId = async function (classification_id) {
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
        console.error("getInventoryByClassificationId error:", error.stack)
        return []
    }
}

/* ***************************
 * Get inventory item by inv_id
 * ************************** */
inventoryModel.getVehicleById = async function (inv_id) {
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
        console.error("getVehicleById error:", error.stack)
        return []
    }
}

/* ***************************
 * Add new classification
 * ************************** */
inventoryModel.addClassification = async function (classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        const result = await pool.query(sql, [classification_name])
        return result.rows[0]
    } catch (error) {
        console.error("addClassification error:", error.stack)
        throw error
    }
}

/* ***************************
 * Add new inventory item
 * ************************** */
inventoryModel.addInventory = async function (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
    try {
        const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        const result = await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color])
        return result.rows[0]
    } catch (error) {
        console.error("addInventory error:", error.stack)
        throw error
    }
}

/* ***************************
 * Update maintenance status
 * ************************** */
inventoryModel.updateMaintenanceStatus = async function (inv_id, status) {
    try {
        if (!status || !["Needs Maintenance", "Maintenance Completed"].includes(status)) {
            throw new Error("Invalid or missing status value.")
        }
        const sql = `
            UPDATE public.inventory
            SET inv_status = jsonb_build_object(
                'status', $1::text,
                'updated_at', CURRENT_TIMESTAMP
            )
            WHERE inv_id = $2
            RETURNING inv_status
        `
        const result = await pool.query(sql, [status, inv_id])
        console.log("updateMaintenanceStatus result:", result ? result.rows : "No data returned")
        return result.rows[0]?.inv_status || {}
    } catch (error) {
        console.error("updateMaintenanceStatus error:", error.message)
        throw new Error("Failed to update maintenance status.")
    }
}

/* ***************************
 * Get maintenance status by ID
 * ************************** */
inventoryModel.getMaintenanceStatusById = async function (inv_id) {
    try {
        const sql = `
            SELECT inv_status
            FROM public.inventory
            WHERE inv_id = $1
        `
        const result = await pool.query(sql, [inv_id])
        console.log("getMaintenanceStatusById result:", result ? result.rows : "No data returned")
        return result.rows[0]?.inv_status || { status: "Operational", updated_at: null }
    } catch (error) {
        console.error("getMaintenanceStatusById error:", error.message)
        throw new Error("Failed to retrieve maintenance status.")
    }
}

module.exports = inventoryModel