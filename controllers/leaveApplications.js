const LeaveApplications = require("../models/leaveApplications")
const {
  getAvailableLeavesCount,
  updateRemainingLeavesCount,
} = require("./leaves")()
const { responseFlags, CustomError } = require("../utils/constants")
const { errorResponse, successResponse } = require("../utils/responseHelpers")
const mongoose = require("mongoose")

module.exports = function () {
  return {
    list: async function (req, res) {
      const queryObject = {}
      if (!(req.isAdmin() || req.isHR()))
        queryObject.createdBy = req.session.user._id
      const leaveApplications = await LeaveApplications.find(queryObject)
        .populate({
          path: "createdBy",
          select: "fullname code leaves",
          populate: { path: "leaves", select: "leaveType count" },
        })
        .populate("updatedBy", "-_id fullname code")
        .populate("approvedBy", "-_id fullname code")
        .populate("cancelledBy", "-_id fullname code")
        .populate("leaveType", "title description code")
      return successResponse(res, responseFlags.SUCCESS, {
        leaveApplications,
      })
    },

    apply: async function (req, res) {
      const { leaveType, fromDate, toDate, reason } = req.body
      const createdBy = req.session.user._id,
        createdByOnModel = req.session.onModel
      if (new Date(fromDate) < new Date() || new Date(toDate) < new Date())
        throw new CustomError(
          "BAD_REQUEST",
          "Can not apply leave for be past dates",
        )
      if (new Date(toDate) < new Date(fromDate))
        throw new CustomError(
          "BAD_REQUEST",
          "To date should be greater than or equals to from date",
        )

      const availableLeaves = await getAvailableLeavesCount({
        employee: createdBy,
        leaveType,
      })
      if (!availableLeaves) throw new CustomError("CONFLICT", "No leaves found")
      const { count: availableLeavesCount = 0 } = availableLeaves
      const appliedLeavesCount =
        new Date(toDate).getDate() - new Date(fromDate).getDate() || 1
      if (appliedLeavesCount > availableLeavesCount)
        return errorResponse(
          res,
          responseFlags.CONFLICT,
          new CustomError(
            "CONFLICT",
            `Leaves applied: ${appliedLeavesCount}, Leaves available: ${availableLeavesCount}`,
          ),
        )
      await new LeaveApplications({
        leaveType,
        fromDate,
        toDate,
        appliedLeavesCount,
        reason,
        createdBy,
        updatedBy: createdBy,
        createdByOnModel,
        updatedByOnModel: createdByOnModel,
      }).save()
      return successResponse(res, responseFlags.CREATED, {
        message: "Record created successfully",
      })
    },

    update: async function (req, res) {
      const { id } = req.params
      const { leaveType, fromDate, toDate, reason } = req.body
      if (new Date(fromDate) < new Date() || new Date(toDate) < new Date())
        throw new CustomError(
          "BAD_REQUEST",
          "Can not apply leave for past dates",
        )
      if (new Date(toDate) < new Date(fromDate))
        throw new CustomError(
          "BAD_REQUEST",
          "To date should be greater than or equals to from date",
        )

      const availableLeaves = await getAvailableLeavesCount({
        employee: req.session.user._id,
        leaveType,
      })
      if (!availableLeaves) throw new CustomError("CONFLICT", "No leaves found")
      const { count: availableLeavesCount = 0 } = availableLeaves
      const appliedLeavesCount =
        new Date(toDate).getDate() - new Date(fromDate).getDate() || 1
      if (appliedLeavesCount > availableLeavesCount)
        return errorResponse(
          res,
          responseFlags.CONFLICT,
          new CustomError(
            "CONFLICT",
            `Leaves applied: ${appliedLeavesCount}, Leaves available: ${availableLeavesCount}`,
          ),
        )
      const leaveApplication = await LeaveApplications.findOneAndUpdate(
        { _id: id, createdBy: req.session.user._id },
        {
          $set: {
            leaveType,
            fromDate,
            appliedLeavesCount,
            toDate,
            reason,
          },
        },
      )
      if (!leaveApplication)
        throw new CustomError("NOT_FOUND", "No record found.")
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record updated successfully",
      })
    },

    view: async function (req, res) {
      const { id } = req.params
      const leaveApplication = await LeaveApplications.findById(id)
        .populate({
          path: "createdBy",
          select: "fullname code leaves",
          populate: { path: "leaves" },
        })
        .populate("leaveType")
      return successResponse(res, responseFlags.SUCCESS, leaveApplication)
    },

    cancel: async function (req, res) {
      const { id } = req.params
      const { cancellationReason } = req.body
      const isHrOrAdmin = req.isAdmin() || req.isHR()
      const cancelledBy = req.session.user._id,
        cancelledByOnModel = req.session.onModel
      const leaveApplication = await LeaveApplications.findById(id)
      if (
        leaveAppication &&
        !isHrOrAdmin &&
        leaveAppication.employee !== req.session.user._id
      )
        throw new CustomError(
          "FORBIDDEN",
          "Only HR/Admin and applicant is allowed to cancel a leave application",
        )
      leaveApplication.isCancelled = true
      leaveApplication.cancellationReason = cancellationReason
      leaveApplication.cancelledBy = cancelledBy
      leaveApplication.cancelledByOnModel = cancelledByOnModel
      await leaveApplication.save()
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record updated successfully",
      })
    },

    approve: async function (req, res) {
      const session = await mongoose.startSession()
      try {
        if (!(req.isAdmin() || req.isHR()))
          throw new CustomError("FORBIDDEN", "Operation not allowed")
        const { id } = req.params
        const approvedBy = req.session.user._id,
          approvedByOnModel = req.session.onModel

        session.startTransaction()

        const updatedRecord = await LeaveApplications.findOneAndUpdate(
          {
            _id: id,
            isCancelled: false,
            isApproved: false,
          },
          {
            $set: {
              isApproved: true,
              approvedBy,
              approvedByOnModel,
            },
          },
          { session },
        )

        if (!updatedRecord)
          throw new CustomError(
            "BAD_REQUEST",
            "Leave application is either approved or cancelled already.",
          )

        const {
          createdBy: employee,
          leaveType,
          appliedLeavesCount,
        } = updatedRecord

        await updateRemainingLeavesCount({
          employee,
          leaveType,
          approvedLeavesCount: appliedLeavesCount,
          session,
        })

        await session.commitTransaction()
        session.endSession()

        return successResponse(res, responseFlags.SUCCESS, {
          message: "Record updated successfully",
        })
      } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw new Error(error)
      }
    },
  }
}
