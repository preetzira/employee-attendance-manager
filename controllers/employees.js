const crypto = require("crypto")
const Employees = require("../models/employees")
const { responseFlags, CustomError } = require("../utils/constants")
const { successResponse } = require("../utils/responseHelpers")
const { createSession } = require("../utils/session")
const { sendMail } = require("../services/emailer")
const { validatePassword } = require("../utils/validators")

module.exports = function () {
  return {
    list: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const employees = await Employees.find(
        { isDeleted: false },
        "-password -tokens",
      )
        .populate({
          path: "leaves",
          select: "leaveType count",
          populate: { path: "leaveType", select: "title description code" },
        })
        .populate("designation", "title description")
        .populate("department", "title description")
        .populate({
          path: "reportsTo",
          select: "fullname code designation",
          populate: { path: "designation", select: "title code" },
        })
        .populate({
          path: "createdBy",
          select: "-_id fullname code designation",
          populate: { path: "designation", select: "title code" },
        })
        .populate({
          path: "updatedBy",
          select: "-_id fullname code designation",
          populate: { path: "designation", select: "title code" },
        })
      return successResponse(res, responseFlags.SUCCESS, employees)
    },

    create: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const {
        fullname,
        gender,
        dateOfBirth,
        email,
        password,
        code,
        permanentAddress,
        currentAddress,
        phone,
        personalEmail,
        joinedOn,
        reportsTo,
        leaves,
        designation,
        department,
        profileImage,
      } = req.body
      const createdBy = req.session.user._id,
        createdByOnModel = req.session.onModel

      const employeeExists = await Employees.findOne({ email })
      if (employeeExists)
        throw new CustomError(
          "CONFLICT",
          "An employee already exists with this email",
        )

      if (!validatePassword(password))
        throw new CustomError(
          "BAD_REQUEST",
          "Password should length 8-20 characters, at least one uppercase letter, one lowercase letter, one number and one special character @,$,!,%,*,?,&",
        )

      const tokens = {
        emailVerificationToken: crypto.randomBytes(6).toString("hex"),
        emailVerificationTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 45),
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: new Date(),
      }

      await new Employees({
        fullname,
        email,
        password,
        gender,
        dateOfBirth,
        permanentAddress,
        code,
        currentAddress,
        phone,
        personalEmail,
        tokens,
        joinedOn,
        reportsTo,
        leaves,
        designation,
        department,
        profileImage,
        createdBy,
        updatedBy: createdBy,
        createdByOnModel,
        updatedByOnModel: createdByOnModel,
      }).save()
      const { message, info } = await sendMail({
        to: email,
        subject: "Email verification mail",
        html: `<h1>Verify</h1>http://${req.headers.host}/verify/${tokens.emailVerificationToken}`,
      })
      console.log({ message, info })
      return successResponse(res, responseFlags.CREATED, {
        message: "Record created successfully",
      })
    },

    login: async function (req, res) {
      const { email, password } = req.body
      const employee = await Employees.findOne({ email })
      if (!employee || employee.isDeleted)
        throw new CustomError(
          "NOT_FOUND",
          "No employee account exists with this email",
        )

      if (employee && !employee.emailVerified)
        throw new CustomError("FORBIDDEN", "Kindly verify your email first")

      if (employee && !employee.comparePassword(password))
        throw new CustomError("FORBIDDEN", "Kindly check your password again")

      if (employee && employee.comparePassword(password)) {
        const token = await createSession({
          user: employee._id,
          req,
          res,
          onModel: "Employee",
        })
        return successResponse(res, responseFlags.SUCCESS, {
          ...token,
        })
      }
    },

    changePassword: async function (req, res) {
      const { currentPassword, newPassword, confirmNewPassword } = req.body
      const { employeeId, token } = req.params
      const queryObject = {}
      let isHrOrAdmin = req.isHR() || req.isAdmin()
      if (req.isAuthenticated() && !isHrOrAdmin) {
        queryObject._id = req.session.user._id
      }
      if (isHrOrAdmin && employeeId !== req.session.user._id) {
        queryObject._id = employeeId
      }
      if (token && !req.isAuthenticated()) {
        queryObject["tokens.resetPasswordToken"] = token
      }

      if (!queryObject._id || queryObject._id === ",")
        throw new CustomError(
          "BAD_REQUEST",
          "Required parameter 'employeeId' is malformed or missing",
        )
      const employee = await Employees.findOne(queryObject)
      // Check for reset password scenario where token is either invalid or expired
      if (
        !req.isAuthenticated() &&
        token &&
        (!employee ||
          (employee &&
            new Date() > new Date(employee.tokens.resetPasswordTokenExpiresAt)))
      )
        throw new CustomError(
          "FORBIDDEN",
          "Reset password token in either invalid or expired",
        )

      // Check for logged-in user trying to change password and current password doesn't match
      if (
        req.isAuthenticated() &&
        String(req.session.user._id) === String(employee._id) &&
        !employee.comparePassword(currentPassword)
      )
        throw new CustomError("FORBIDDEN", "Kindly check your current password")

      // Check where password is updated when any of the scenarios met the conditions
      if (
        (req.isAuthenticated() &&
          String(req.session.user._id) === String(employee._id) &&
          employee.comparePassword(currentPassword)) ||
        (isHrOrAdmin && employeeId !== String(req.session.user._id)) ||
        (token && token === employee.tokens.resetPasswordToken)
      ) {
        if (newPassword !== confirmNewPassword)
          throw new CustomError("BAD_REQUEST", "New password didn't match")
        if (!validatePassword(newPassword))
          throw new CustomError(
            "BAD_REQUEST",
            "Password should length 8-20 characters, at least one uppercase letter, one lowercase letter, one number and one special character @,$,!,%,*,?,&",
          )
        employee.password = newPassword
        employee.updatedBy = req.isAuthenticated()
          ? req.session.user._id
          : employee._id
        employee.updatedByOnModel = req.isAuthenticated()
          ? req.session.onModel
          : "Employee"
        employee.tokens.resetPasswordToken = null
        employee.tokens.resetPasswordTokenExpiresAt = new Date()
        await employee.save()
        return successResponse(res, responseFlags.SUCCESS, {
          message: "Password changed successfully",
        })
      }
    },

    update: async function (req, res) {
      const isHrOrAdmin = req.isHR() || req.isAdmin()
      const {
        fullname,
        password,
        gender,
        dateOfBirth,
        email,
        code,
        permanentAddress,
        currentAddress,
        phone,
        personalEmail,
        joinedOn,
        reportsTo,
        leaves,
        designation,
        department,
        profileImage,
      } = req.body
      const updatedBy = req.session.user._id,
        updatedByOnModel = req.session.onModel

      const updateObject = {
        fullname,
        phone,
        gender,
        dateOfBirth,
        permanentAddress,
        currentAddress,
        personalEmail,
        profileImage,
        updatedBy,
        updatedByOnModel,
      }

      const queryObject = {}

      if (isHrOrAdmin) {
        delete updateObject.password
        updateObject.code = code
        updateObject.email = email
        updateObject.joinedOn = joinedOn
        updateObject.reportsTo = reportsTo
        updateObject.leaves = leaves
        updateObject.designation = designation
        updateObject.department = department
        queryObject._id = req.params.employeeId
      } else queryObject._id = req.session.user._id

      if (!queryObject._id || queryObject._id === ",")
        throw new CustomError(
          "BAD_REQUEST",
          "Required parameter 'employeeId' is malformed or missing",
        )
      const employee = await Employees.findOne(queryObject)
      if (
        (employee._id =
          req.session.user._id && !employee.comparePassword(password))
      )
        throw new CustomError("FORBIDDEN", "Kindly check your current password")

      Object.assign(employee, {}, updateObject)
      await employee.save()
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record updated successfully",
      })
    },

    view: async function (req, res) {
      const isHrOrAdmin = req.isAdmin() || req.isHR()
      const id = isHrOrAdmin ? req.params.employeeId : req.session.user._id
      if (!id || id === ",")
        throw new CustomError(
          "BAD_REQUEST",
          "Required parameters 'employeeId' is malformed or missing",
        )
      const selectEmployeeFields = isHrOrAdmin
        ? "-password -tokens"
        : "-password -tokens -isDeleted"
      const employee = await Employees.findById(id, selectEmployeeFields)
        .populate({
          path: "leaves",
          select: "leaveType employeeCode count",
          populate: { path: "leaveType", select: "title description code" },
        })
        .populate("designation", "title description")
        .populate("department", "title description")
        .populate({
          path: "reportsTo",
          select: "fullname code designation",
          populate: { path: "designation", select: "title code" },
        })
        .populate({
          path: "createdBy",
          select: "-_id fullname code designation",
          populate: { path: "designation", select: "title code" },
        })
        .populate({
          path: "updatedBy",
          select: "-_id fullname code designation",
          populate: { path: "designation", select: "title code" },
        })
      return successResponse(res, responseFlags.SUCCESS, employee)
    },

    delete: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { employeeId } = req.params
      const updatedBy = req.session.user._id,
        updatedByOnModel = req.session.onModel
      await Employees.findByIdAndUpdate(employeeId, {
        $set: { isDeleted: true, updatedBy, updatedByOnModel },
      })
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record deleted successfully",
      })
    },

    resendEmailVerificationMail: async function (req, res) {
      if (req.isAdmin()) new CustomError("FORBIDDEN", "Not an admin operation")
      const id = req.session.user._id
      const employee = await Employees.findById(id)

      if (employee && employee.emailVerified)
        throw new CustomError("BAD_REQUEST", "Email already verified")

      const timelapse =
        new Date(employee.tokens.emailVerificationTokenExpiresAt) - new Date()
      if (timelapse > 1000 * 60 * 40)
        throw new CustomError(
          "FORBIDDEN",
          "Please wait for alteast 5 minutes before re-request",
        )

      if (timelapse < 1000 * 60 * 5) {
        employee.tokens.emailVerificationToken = crypto
          .randomBytes(6)
          .toString("hex")
        employee.tokens.emailVerificationTokenExpiresAt = new Date(
          Date.now() + 1000 * 60 * 45,
        )
      }

      await employee.save()
      const { message, info } = await sendMail({
        to: email,
        subject: "Email verification mail",
        html: `<h1>Verify</h1>http://${req.headers.host}/verify/${employee.tokens.emailVerificationToken}`,
      })
      console.log({ message, info })
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Verification email sent successfully",
      })
    },

    verifyEmail: async function (req, res) {
      const { token } = req.params
      // console.log(token)
      const employee = await Employees.findOne({
        "tokens.emailVerificationToken": token,
        "tokens.emailVerificationTokenExpiresAt": { $gt: new Date() },
      })

      if (!employee)
        throw new CustomError(
          "FORBIDDEN",
          "Verification token is either invalid or expired",
        )

      employee.emailVerified = true
      employee.tokens.emailVerificationTokenExpiresAt = new Date()
      await employee.save()
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Email verified successfully",
      })
    },

    resetPassword: async function (req, res) {
      const { email } = req.body
      const employee = await Employees.findOne({ email })

      if (!employee)
        throw new CustomError("NOT_FOUND", "No user exists with this email")
      const timelapse =
        new Date(employee.tokens.resetPasswordTokenExpiresAt) - new Date()

      if (timelapse > 1000 * 60 * 40)
        throw new CustomError(
          "FORBIDDEN",
          "Please wait for alteast 5 minutes before re-request",
        )

      if (timelapse < 1000 * 60 * 5) {
        employee.tokens.resetPasswordToken = crypto
          .randomBytes(6)
          .toString("hex")
        employee.tokens.resetPasswordTokenExpiresAt = new Date(
          Date.now() + 1000 * 60 * 45,
        )
      }

      await employee.save()
      const mailOptions = {
        to: email,
        subject: "Password Reset",
        html: `http://${req.headers.host}/reset/${employee.tokens.resetPasswordToken}`,
      }
      const { message, info } = await sendMail(mailOptions)
      console.log({ message, info })
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Password reset link has been sent to your email",
      })
    },

    addLeaveToEmployeeCollection: async ({ leave, session }) => {
      const employee = await Employees.findById(leave[0].employee).session(
        session,
      )
      employee.leaves.addToSet(leave[0]._id)
      return employee.save()
    },
  }
}
