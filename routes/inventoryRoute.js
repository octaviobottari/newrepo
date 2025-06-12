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
router.get("/", utilities.checkJWTToken, utilities.handleErrors(invController.buildManagement))

// Route to build add classification view (protected)
router.get("/add-classification", utilities.checkJWTToken, utilities.handleErrors(invController.buildAddClassification))

// Route to process add classification (protected)
router.post(
    "/add-classification",
    utilities.checkJWTToken,
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.processAddClassification)
)

// Route to build add inventory view
router.get("/add-inventory", utilities.checkJWTToken, utilities.handleErrors(invController.buildAddInventory))

// Route to process add inventory
router.post(
    "/add-inventory",
    utilities.checkJWTToken,
    validate.inventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.processAddInventory)
)

// Route to update maintenance status (protected)
router.post(
    "/maintenance",
    utilities.checkJWTToken,
    utilities.checkAdminOrEmployee,
    validate.maintenanceRules(),
    validate.checkMaintenanceData,
    utilities.handleErrors(invController.updateMaintenanceStatus)
)

module.exports = router