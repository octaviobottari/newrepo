const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

/* ***************************
 *  Build inventory by classification view
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
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build vehicle detail view
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
    const detail = await utilities.buildVehicleDetail(data)
    let nav = await utilities.getNav()
    const vehicle = data[0]
    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detail,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Trigger intentional 500 error
 * ************************** */
invController.triggerError = async function (req, res, next) {
  throw new Error("Intentional Server Error")
}

/* ***************************
 *  Build management view
 * ************************** */
invController.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
        layout: "./layouts/layout"
    })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invController.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        layout: "./layouts/layout"
    })
}

/* ***************************
 *  Process add classification
 * ************************** */
invController.processAddClassification = async function (req, res, next) {
    const { classification_name } = req.body
    try {
        const result = await invModel.addClassification(classification_name)
        if (result) {
            let nav = await utilities.getNav()
            req.flash("notice", `Classification ${classification_name} added successfully.`)
            res.redirect("/inv/")
        } else {
            let nav = await utilities.getNav()
            req.flash("error", "Failed to add classification. Please try again.")
            res.render("inventory/add-classification", {
                title: "Add New Classification",
                nav,
                errors: null,
                classification_name,
                layout: "./layouts/layout"
            })
        }
    } catch (error) {
        let nav = await utilities.getNav()
        req.flash("error", "Classification addition failed. Please try again.")
        res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
            classification_name,
            layout: "./layouts/layout"
        })
    }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invController.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
        errors: null,
        layout: "./layouts/layout"
    })
}

/* ***************************
 *  Process add inventory
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
        if (result) {
            let nav = await utilities.getNav()
            req.flash("notice", `Vehicle ${inv_make} ${inv_model} added successfully.`)
            res.redirect("/inv/")
        } else {
            let nav = await utilities.getNav()
            let classificationList = await utilities.buildClassificationList(classification_id)
            req.flash("error", "Failed to add vehicle. Please try again.")
            res.render("inventory/add-inventory", {
                title: "Add New Inventory",
                nav,
                classificationList,
                errors: null,
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
    } catch (error) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        req.flash("error", "Vehicle addition failed. Please try again.")
        res.render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationList,
            errors: null,
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

module.exports = invController