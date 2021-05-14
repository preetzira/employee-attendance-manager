const { responseFlags } = require("../utils/constants")
const { successResponse, errorResponse } = require("../utils/responseHelpers")
const { AuthSession, expireSession } = require("../utils/session")

module.exports = async function authChecker(req, res, next) {
  if (req.path.match(/(reset_password|(admin|employee)\/login)/gi)) {
    const isFalse = () => false
    req.isAdmin = isFalse
    req.isHR = isFalse
    req.isAuthenticated = isFalse
    return next()
  }
  const sessionError = "Session authorization failed, Kindly login again"
  let { token = null } = req.signedCookies
  if (!token && req.header("authorization")) token = req.header("authorization")
  if (token) {
    try {
      if (req.path.match(/logout/gi)) {
        await AuthSession.destroy(token)
        expireSession({ res })
        return successResponse(res, responseFlags.SUCCESS, {
          message: "User logged out successfully",
        })
      }
      const session = await AuthSession.decoded(token)
      if (session) {
        req.session = session
        req.isAdmin = () => session.onModel === "Admin"
        req.isHR = () =>
          session.onModel === "Employee" &&
          session.user.designation &&
          session.user.designation.title.match(/hr/gi)
        req.isAuthenticated = () => true
        return next()
      } else {
        expireSession({ res })
        throw new Error(sessionError)
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        expireSession({ res })
      }
      return errorResponse(res, responseFlags.NOT_LOGGED_IN, error)
    }
  } else
    return errorResponse(res, responseFlags.FORBIDDEN, new Error(sessionError))
}
