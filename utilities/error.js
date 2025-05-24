const errorHandler = (err, req, res, next) => {
  err.status = err.status || 500
  err.message = err.message || "Server Error"
  console.error(`Error ${err.status}: ${err.message}`)
  res.status(err.status).render("errors/error", {
    title: `${err.status} Error`,
    message: err.message,
    nav: "",
  })
}

module.exports = { errorHandler }