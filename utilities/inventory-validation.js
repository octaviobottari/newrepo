
const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification name.")
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Classification name must not contain spaces or special characters.")
    ]
}

/* ******************************
 * Check classification data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
            layout: "./layouts/layout"
        })
        return
    }
    next()
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("classification_id")
            .isInt({ min: 1 })
            .withMessage("Please select a valid classification."),
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Make must be at least 3 characters."),
        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Model must be at least 3 characters."),
        body("inv_year")
            .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
            .withMessage("Year must be a valid 4-digit number."),
        body("inv_description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Description is required."),
        body("inv_image")
            .trim()
            .matches(/^\/images\/vehicles\/.*/)
            .withMessage("Image path must start with /images/vehicles/."),
        body("inv_thumbnail")
            .trim()
            .matches(/^\/images\/vehicles\/.*/)
            .withMessage("Thumbnail path must start with /images/vehicles/."),
        body("inv_price")
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),
        body("inv_miles")
            .isInt({ min: 0 })
            .withMessage("Miles must be a positive whole number."),
        body("inv_color")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Color must be at least 3 characters.")
    ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Inventory",
            nav,
            classificationList,
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
        return
    }
    next()
}

module.exports = validate
