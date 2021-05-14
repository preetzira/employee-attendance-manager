const Holidays = require("../models/holidays")
const { responseFlags, CustomError } = require("../utils/constants")
const { successResponse } = require("../utils/responseHelpers")

module.exports = function () {
  return {
    list: async function (req, res) {
      const holidays = await Holidays.find(
        {},
        "title description fromDate toDate createdAt updatedAt",
      )
      return successResponse(res, responseFlags.SUCCESS, {
        holidays,
      })
    },
    create: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { title, description, fromDate, toDate = fromDate } = req.body
      if (new Date(fromDate) < new Date() || new Date(toDate) < new Date())
        throw new CustomError(
          "BAD_REQUEST",
          "Can not create holiday for past dates",
        )
      if (new Date(toDate) < new Date(fromDate))
        throw new CustomError(
          "BAD_REQUEST",
          "To date should be greater than or equals to from date",
        )
      const createdBy = req.session.user._id,
        createdByOnModel = req.session.onModel
      await Holidays.create({
        title,
        description,
        fromDate,
        toDate,
        createdBy,
        updatedBy: createdBy,
        createdByOnModel,
        updatedByOnModel: createdByOnModel,
      })
      return successResponse(res, responseFlags.CREATED, {
        message: "Record created successfully",
        status: 201,
      })
    },
    view: async function (req, res) {
      const { id } = req.params
      const holiday = await Holidays.findById(
        id,
        "title description fromDate toDate createdAt updatedAt",
      )
      return successResponse(res, responseFlags.SUCCESS, holiday)
    },
    update: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { title, description, formDate, toDate } = req.body
      if (new Date(fromDate) < new Date() || new Date(toDate) < new Date())
        throw new CustomError(
          "BAD_REQUEST",
          "Can not create holiday for past dates",
        )
      if (new Date(toDate) < new Date(fromDate))
        throw new CustomError(
          "BAD_REQUEST",
          "To date should be greater than or equals to from date",
        )
      const { id } = req.params
      const updatedBy = req.session.user._id,
        updatedByOnModel = req.session.onModel
      const holiday = await Holidays.findByIdAndUpdate(id, {
        $set: {
          title,
          description,
          formDate,
          toDate,
          updatedBy,
          updatedByOnModel,
        },
      })
      if (!holiday) throw new CustomError("NOT_FOUND", "No record found.")
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record updated successfully",
        status: 200,
      })
    },
    delete: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { id } = req.params
      const deletedRecord = await Holidays.findByIdAndDelete(id)
      if (!deletedRecord) throw new CustomError("NOT_FOUND", "No record found.")
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record deleted successfully",
        status: 200,
      })
    },
  }
}
