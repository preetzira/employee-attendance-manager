module.exports = function asyncMiddleware(fun) {
  return (req, res, next) => {
    if (Array.isArray(fun)) {
      return fun.map((f, cb) => {
        Promise.resolve(f(req, res, (err) => cb(err))).catch((err) => next(err))
      }, next)
    }
    return Promise.resolve(fun(req, res, next)).catch((err) => next(err))
  }
}
