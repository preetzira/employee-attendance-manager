const { responseFlags, CustomError } = require("../utils/constants")
const logger = require("../utils/logger")
const { errorResponse } = require("../utils/responseHelpers")

module.exports = function errorHandler(error, req, res, next) {
  logger.error(
    `
    ErrorStack: \x1b[31m${error.stack}\x1b[0m
    ErrorObject: \x1b[31m${JSON.stringify(error)}\x1b[0m
    RequestBody: ${JSON.stringify(req.body, replacer)}
    RequestParams: ${JSON.stringify(req.params, replacer)}
    RequestQuery: ${JSON.stringify(req.query, replacer)}
    RequestMethod: ${req.method}
    RequestPath: ${req.path}
    `,
  )
  const flagName =
    error instanceof CustomError ? error.name : "INTERNAL_SERVER_ERR"
  return errorResponse(res, responseFlags[flagName], error)
}

function replacer(key, value) {
  if (key.match(/password/gi) && value) {
    return "**********"
  }
  return value
}
