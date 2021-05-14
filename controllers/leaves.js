const Leaves = require("../models/leaves")
const { addLeaveToEmployeeCollection } = require("../controllers/employees")()
const { responseFlags, CustomError } = require("../utils/constants")
const { successResponse } = require("../utils/responseHelpers")
const mongoose = require("mongoose")

module.exports = function () {
  return {
    list: async function (req, res) {
      const { employeeId } = req.params
      const queryObject =
        req.isHR() || req.isAdmin()
          ? employeeId
            ? { employee: employeeId }
            : { employee: req.session.user._id }
          : {}
      const leaves = await Leaves.find(queryObject)
        .populate("employee", "fullname code email")
        .populate("createdBy", "-_id fullname code email")
        .populate("updatedBy", "-_id fullname code email")
        .populate("leaveType", "title description code")

      return successResponse(res, responseFlags.SUCCESS, {
        leaves,
      })
    },

    create: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const session = await mongoose.startSession()
      try {
        const { employee, leaveType, count } = req.body
        const createdBy = req.session.user._id,
          createdByOnModel = req.session.onModel

        session.startTransaction()

        const leave = await Leaves.create(
          [
            {
              employee,
              leaveType,
              count,
              createdBy,
              updatedBy: createdBy,
              createdByOnModel,
              updatedByOnModel: createdByOnModel,
            },
          ],
          { session },
        )
        await addLeaveToEmployeeCollection({ leave, session })

        await session.commitTransaction()
        await session.endSession()
        return successResponse(res, responseFlags.CREATED, {
          message: "Record created successfully",
          status: 201,
        })
      } catch (error) {
        console.log(error)
        await session.abortTransaction()
        session.endSession()
        throw new Error(error)
      }
    },

    view: async function (req, res) {
      const { id } = req.params
      const leaveType = await Leaves.findById(
        id,
        "employee leaveType count createdAt updatedAt",
      )
        .populate("employee", "fullname code email")
        .populate("leaveType")

      return successResponse(res, responseFlags.SUCCESS, leaveType)
    },

    update: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { employee, leaveType, count } = req.body
      const { id } = req.params
      const updatedBy = req.session.user._id,
        updatedByOnModel = req.session.onModel
      const leave = await Leaves.findByIdAndUpdate(id, {
        $set: {
          employee,
          leaveType,
          count,
          updatedBy,
          updatedByOnModel,
        },
      })
      if (!leave) throw new CustomError("NOT_FOUND", "No record found.")
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record updated successfully",
        status: 200,
      })
    },

    delete: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { id } = req.params
      const deletedRecord = await Leaves.findByIdAndDelete(id)
      if (!deletedRecord) throw new CustomError("NOT_FOUND", "No record found.")
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record deleted successfully",
        status: 200,
      })
    },

    getAvailableLeavesCount: async function ({ employee, leaveType }) {
      return Leaves.findOne({ employee, leaveType }, "count")
    },

    updateRemainingLeavesCount: async function ({
      employee,
      leaveType,
      approvedLeavesCount,
      session,
    }) {
      return Leaves.findOneAndUpdate(
        { employee, leaveType },
        { $inc: { count: -approvedLeavesCount } },
        { session },
      )
    },
  }
}
