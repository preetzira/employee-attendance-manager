class CustomError extends Error {
  constructor(name, message) {
    super(message)
    this._name = name
  }

  get name() {
    return this._name
  }
}

function define(obj, name, value) {
  Object.defineProperty(obj, name, {
    value: value,
    enumerable: true,
    writable: false,
    configurable: false,
  })
}

exports.responseFlags = {}
exports.CustomError = CustomError
define(exports.responseFlags, "SUCCESS", 200)
define(exports.responseFlags, "CREATED", 201)
define(exports.responseFlags, "BAD_REQUEST", 400)
define(exports.responseFlags, "NOT_LOGGED_IN", 401)
define(exports.responseFlags, "FORBIDDEN", 403)
define(exports.responseFlags, "NOT_FOUND", 404)
define(exports.responseFlags, "CONFLICT", 409)
define(exports.responseFlags, "INTERNAL_SERVER_ERR", 500)
