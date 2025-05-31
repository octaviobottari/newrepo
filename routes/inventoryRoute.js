const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByVehicleId))

// Route to trigger intentional 500 error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to process add classification
router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.processAddClassification)
)

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to process add inventory
router.post(
    "/add-inventory",
    validate.inventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.processAddInventory)
)

module.exports = router