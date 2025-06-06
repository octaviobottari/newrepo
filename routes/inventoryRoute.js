const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")
const accountController = require("../controllers/accountController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByVehicleId))

// Route to trigger intentional 500 error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

// Route to build management view (protected)
router.get("/", accountController.checkJWT, utilities.handleErrors(invController.buildManagement))

// Route to build add classification view (protected)
router.get("/add-classification", accountController.checkJWT, utilities.handleErrors(invController.buildAddClassification))

// Route to process add classification (protected)
router.post(
    "/add-classification",
    accountController.checkJWT,
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.processAddClassification)
)

// Route to build add inventory view (protected)
router.get("/add-inventory", accountController.checkJWT, utilities.handleErrors(invController.buildAddInventory))

// Route to process add inventory (protected)
router.post(
    "/add-inventory",
    accountController.checkJWT,
    validate.inventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.processAddInventory)
)

module.exports = router