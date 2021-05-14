const Admin = require("../models/admin")
const { responseFlags, CustomError } = require("../utils/constants")
const { createSession } = require("../utils/session")
const { successResponse } = require("../utils/responseHelpers")

module.exports = function () {
  return {
    create: async function (req, res) {
      const { fullname, email, password } = req.body
      const adminExists = await Admin.findOne({ email })
      if (adminExists)
        throw new CustomError(
          "CONFLICT",
          "A Admin already exists with this email",
        )
      const admin = await new Admin({ fullname, email, password }).save()
      const token = await createSession({
        user: admin._id,
        req,
        res,
        onModel: "Admin",
      })
      return successResponse(res, responseFlags.SUCCESS, {
        ...token,
      })
    },

    login: async function (req, res) {
      const { email, password } = req.body

      const admin = await Admin.findOne({ email })

      if (!admin)
        throw new CustomError(
          "NOT_FOUND",
          "No Admin account exists with this email",
        )

      if (admin && !admin.comparePassword(password))
        throw new CustomError("BAD_REQUEST", "Kindly check your password again")

      if (admin && admin.comparePassword(password)) {
        const token = await createSession({
          user: admin._id,
          req,
          res,
          onModel: "Admin",
        })
        return successResponse(res, responseFlags.SUCCESS, {
          ...token,
        })
      }
    },

    changePassword: async function (req, res) {
      const { currentPassword, newPassword, confirmNewPassword } = req.body

      const admin = Admin.findOne({ _id: req.session.user._id })

      if (admin && !admin.comparePassword(currentPassword))
        throw new CustomError(
          "BAD_REQUEST",
          "Kindly check your current password",
        )

      if (admin && admin.comparePassword(currentPassword)) {
        if (newPassword !== confirmNewPassword)
          throw new CustomError("BAD_REQUEST", "New password didn't match")
        else admin.password = newPassword
      }
      await admin.save()
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Password changed successfully",
      })
    },

    view: async function (req, res) {
      const id = req.session.user._id
      const admin = await Admin.findById(id, "-_id -password")
      return successResponse(res, responseFlags.SUCCESS, {
        admin,
      })
    },
  }
}
