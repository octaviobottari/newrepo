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

module.exports = invController