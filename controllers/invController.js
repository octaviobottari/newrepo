const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = parseInt(req.params.classificationId)
        const data = await invModel.getInventoryByClassificationId(classification_id)
        if (data.length === 0) {
            const err = new Error("No vehicles found for this classification")
            err.status = 404
            throw err
        }
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0].classification_name
        res.render("./inventory/classification", {
            title: className + " Vehicles",
            nav,
            grid,
            layout: "./layouts/layout"
        })
    } catch (error) {
        console.error("buildByClassificationId error:", error.stack)
        next(error)
    }
}

/* ***************************
 * Build vehicle detail view
 * ************************** */
invController.buildByVehicleId = async function (req, res, next) {
    try {
        const inv_id = parseInt(req.params.invId)
        const data = await invModel.getVehicleById(inv_id)
        if (data.length === 0) {
            const err = new Error("Vehicle not found")
            err.status = 404
            throw err
        }
        const status = await invModel.getMaintenanceStatusById(inv_id)
        const detail = await utilities.buildVehicleDetail(data)
        let nav = await utilities.getNav()
        res.render("./inventory/detail", {
            title: `${data[0].inv_make} ${data[0].inv_model}`,
            nav,
            detail,
            status,
            inv_id,
            layout: "./layouts/layout"
        })
    } catch (error) {
        console.error("buildByVehicleId error:", error.stack)
        next(error)
    }
}

/* ***************************
 * Trigger intentional 500 error
 * ************************** */
invController.triggerError = async function (req, res, next) {
    throw new Error("Intentional Server Error")
}

/* ***************************
 * Build management view
 * ************************** */
invController.buildManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
            layout: "./layouts/layout"
        })
    } catch (error) {
        console.error("buildManagement error:", error.stack)
        next(error)
    }
}

/* ***************************
 * Build add classification view
 * ************************** */
invController.buildAddClassification = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
            layout: "./layouts/layout"
        })
    } catch (error) {
        console.error("buildAddClassification error:", error.stack)
        next(error)
    }
}

/* ***************************
 * Process add classification
 * ************************** */
invController.processAddClassification = async function (req, res, next) {
    const { classification_name } = req.body
    try {
        const result = await invModel.addClassification(classification_name)
        let nav = await utilities.getNav()
        req.flash("notice", `Classification ${classification_name} added successfully.`)
        res.redirect("/inv/")
    } catch (error) {
        console.error("processAddClassification error:", error.stack)
        let nav = await utilities.getNav()
        req.flash("error", "Failed to add classification. Please try again.")
        res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: [{ msg: error.message }],
            classification_name,
            layout: "./layouts/layout"
        })
    }
}

/* ***************************
 * Build add inventory view
 * ************************** */
invController.buildAddInventory = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList()
        res.render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationList,
            errors: null,
            layout: "./layouts/layout"
        })
    } catch (error) {
        console.error("buildAddInventory error:", error.stack)
        next(error)
    }
}

/* ***************************
 * Process add inventory
 * ************************** */
invController.processAddInventory = async function (req, res, next) {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    try {
        const result = await invModel.addInventory(
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        )
        let nav = await utilities.getNav()
        req.flash("notice", `Vehicle ${inv_make} ${inv_model} added successfully.`)
        res.redirect("/inv/")
    } catch (error) {
        console.error("processAddInventory error:", error.stack)
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        req.flash("error", "Failed to add vehicle. Please try again.")
        res.render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationList,
            errors: [{ msg: error.message }],
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            layout: "./layouts/layout"
        })
    }
}

/* ***************************
 * Update maintenance status
 * ************************** */
invController.updateMaintenanceStatus = async function (req, res, next) {
    const { inv_id, maintenance_status } = req.body
    console.log("Maintenance status update received:", { inv_id, maintenance_status })
    try {
        if (!res.locals.loggedin || !req.user || !['Employee', 'Admin'].includes(req.user.account_type)) {
            req.flash("error", "Please log in with an Employee or Admin account to update maintenance status.")
            return res.redirect(`/inv/detail/${inv_id}`)
        }
        const invId = parseInt(inv_id)
        if (isNaN(invId)) {
            req.flash("error", "Invalid vehicle ID.")
            return res.redirect("/inv/")
        }
        if (!maintenance_status || !["Needs Maintenance", "Maintenance Completed"].includes(maintenance_status)) {
            req.flash("error", "Invalid maintenance status selected.")
            return res.redirect(`/inv/detail/${invId}`)
        }
        const vehicleData = await invModel.getVehicleById(invId)
        if (!vehicleData || vehicleData.length === 0) {
            req.flash("error", "Vehicle not found.")
            return res.redirect("/inv/")
        }
        const result = await invModel.updateMaintenanceStatus(invId, maintenance_status)
        req.flash("notice", `Maintenance status updated to "${maintenance_status}".`)
        res.redirect(`/inv/detail/${invId}`)
    } catch (error) {
        console.error("updateMaintenanceStatus error:", error.stack)
        req.flash("error", "Failed to update maintenance status.")
        res.redirect(`/inv/detail/${inv_id}`)
    }
}

module.exports = invController