const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 * ************************ */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications()
    console.log("getNav received data:", data)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((row) => {
        console.log("Processing row:", row)
        list += "<li>"
        list +=
          '<a href="/inv/type/' +
          row.classification_id +
          '" title="See our inventory of ' +
          row.classification_name +
          ' vehicles">' +
          row.classification_name +
          "</a>"
        list += "</li>"
      })
    } else {
      console.log("No valid classifications found in getNav")
    }
    list += "</ul>"
    return list
  } catch (error) {
    console.error("getNav error: " + error.stack)
    return "<ul><li><a href='/' title='Home page'>Home</a></li></ul>"
  }
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function(data) {
  let grid = ""
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      console.log("Grid image URL:", vehicle.inv_thumbnail)
      grid += '<li>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
      + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id + '" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
Util.buildVehicleDetail = async function(data) {
  let detail = ""
  if (data.length > 0) {
    const vehicle = data[0]
    console.log("Detail image URL:", vehicle.inv_image)
    detail += '<div class="vehicle-detail">'
    detail += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />`
    detail += '<div class="vehicle-info">'
    detail += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`
    detail += `<p><strong>Year:</strong> ${vehicle.inv_year}</p>`
    detail += `<p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
    detail += `<p><strong>Miles:</strong> ${vehicle.inv_miles.toLocaleString()}</p>`
    detail += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`
    detail += `<p><strong>Description:</strong> ${vehicle.inv_description || 'No description available'}</p>`
    detail += `<p><strong>Classification:</strong> ${vehicle.classification_name}</p>`
    detail += '</div>'
    detail += '</div>'
  } else {
    detail += '<p class="notice">Vehicle not found.</p>'
  }
  return detail
}

/* **************************************
 * Build classification dropdown list
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList = '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (classification_id != null && row.classification_id == classification_id) {
            classificationList += " selected"
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* ****************************************
 * Middleware to check JWT token
 * **************************************** */
Util.checkJWTToken = function (req, res, next) {
    const token = req.cookies.jwt
    if (!token) {
        req.user = null
        res.locals.loggedin = false
        res.locals.user = null
        return next()
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        res.locals.loggedin = true
        res.locals.user = decoded
        next()
    } catch (error) {
        console.error("checkJWTToken error:", error.stack)
        res.clearCookie("jwt")
        req.flash("error", "Session expired or invalid. Please log in again.")
        res.redirect("/account/login")
    }
}

/* ****************************************
 * Middleware to check login status
 * **************************************** */
Util.checkLogin = function (req, res, next) {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("error", "Please log in to access this page.")
        res.redirect("/account/login")
    }
}

/* ****************************************
 * Middleware to check Employee or Admin
 * **************************************** */
Util.checkAdminOrEmployee = function (req, res, next) {
    if (res.locals.loggedin && req.user && ['Employee', 'Admin'].includes(req.user.account_type)) {
        next()
    } else {
        req.flash("error", "Access denied. Employee or Admin account required.")
        res.redirect("/account/login")
    }
}

/* ****************************************
 * Middleware For Handling Errors
 * **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 * Get maintenance status by ID
 * **************************************** */
Util.getMaintenanceStatusById = async function (inv_id) {
    try {
      return await invModel.getMaintenanceStatusById(inv_id)
    } catch (error) {
      console.error("getMaintenanceStatusById error:", error.stack)
      return { status: "Operational", updated_at: null }
    }
}

module.exports = Util