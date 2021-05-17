const Attendances = require("../models/attendance")
const { responseFlags, CustomError } = require("../utils/constants")
const { successResponse } = require("../utils/responseHelpers")

module.exports = function () {
  return {
    list: async function (req, res) {
      const { employeeId = null, from = null, to = null } = req.query
      const queryObject = {}
      if (!(req.isAdmin() || req.isHR()))
        queryObject.employee = req.session.user._id
      else if (employeeId) queryObject.employee = employeeId
      if (from || to) queryObject.createdAt = {}
      if (from) queryObject.createdAt.$gte = new Date(from)
      if (to) queryObject.createdAt.$lte = new Date(to)
      const attendances = await Attendances.find(queryObject)
        .populate("employee", "fullname code")
        .populate("createdBy", "-_id fullname code")
        .populate("updatedBy", "-_id fullname code")
      return successResponse(res, responseFlags.SUCCESS, {
        attendances,
      })
    },

    in: async function (req, res) {
      const { remarks = "" } = req.body
      const currentDate = new Date().toLocaleDateString()
      const createdBy = req.session.user._id,
        createdByOnModel = req.session.onModel
      await Attendances.findOneAndUpdate(
        {
          employee: req.session.user._id,
          createdAt: { $gte: new Date(currentDate) },
          in: { $exists: true },
          out: { $exists: false },
        },
        {
          $set: {
            employee: req.session.user._id,
            in: {
              time: new Date(),
              remarks,
            },
            createdBy,
            updatedBy: createdBy,
            createdByOnModel,
            updatedByOnModel: createdByOnModel,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      return successResponse(res, responseFlags.CREATED, {
        message: "Record created successfully",
      })
    },

    out: async function (req, res) {
      const { remarks = "" } = req.body
      const currentDate = new Date().toLocaleDateString()
      const updatedBy = req.session.user._id,
        updatedByOnModel = req.session.onModel
      const attendance = await Attendances.findOneAndUpdate(
        {
          employee: req.session.user._id,
          createdAt: { $gte: new Date(currentDate) },
          out: { $exists: false },
        },
        {
          $set: {
            out: {
              time: new Date(),
              remarks,
            },
            updatedBy,
            updatedByOnModel,
          },
        },
      )
      if (!attendance)
        throw new CustomError("BAD_REQUEST", "Kindly punch-in first.")
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record updated successfully",
      })
    },

    update: async function (req, res) {},

    view: async function (req, res) {
      const { id } = req.params
      const attendance = await Attendances.findById(id)
        .populate("employee", "fullname code")
        .populate("createdBy", "-_id fullname code")
        .populate("updatedBy", "-_id fullname code")
      return successResponse(res, responseFlags.SUCCESS, attendance)
    },

    markAbsentOrOnLeave: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { employeeId } = req.body
      const currentDate = new Date().toLocaleDateString()
      const createdBy = req.session.user._id,
        createdByOnModel = req.session.onModel
      const record = {
        employee: employeeId,
        createdBy,
        updatedBy: createdBy,
        createdByOnModel,
        updatedByOnModel: createdByOnModel,
      }
      if (req.path.match(/absent/gi))
        (record.isAbsent = true), (record.isOnLeave = false)
      else (record.isAbsent = false), (record.isOnLeave = true)
      await Attendances.findOneAndUpdate(
        {
          employee: employeeId,
          createdAt: { $gte: new Date(currentDate) },
        },
        {
          $set: {
            ...record,
          },
        },
        { upsert: true, setDefaultsOnInsert: true },
      )
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record created successfully",
      })
    },
  }
}
