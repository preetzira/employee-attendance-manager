const Departments = require("../models/departments")
const { responseFlags, CustomError } = require("../utils/constants")
const { successResponse } = require("../utils/responseHelpers")

module.exports = function () {
  return {
    list: async function (req, res) {
      const departments = await Departments.find(
        {},
        "title description code createdAt updatedAt",
      )
      return successResponse(res, responseFlags.SUCCESS, {
        departments,
      })
    },
    create: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { title, description, code } = req.body
      const createdBy = req.session.user._id,
        createdByOnModel = req.session.onModel
      await Departments.create({
        title,
        description,
        code,
        createdBy,
        updatedBy: createdBy,
        createdByOnModel,
        updatedByOnModel: createdByOnModel,
      })
      return successResponse(res, responseFlags.CREATED, {
        message: "Record created successfully",
      })
    },
    view: async function (req, res) {
      const { id } = req.params
      const department = await Departments.findById(
        id,
        "title description code createdAt updatedAt",
      )
      return successResponse(res, responseFlags.SUCCESS, department)
    },
    update: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { title, description, code } = req.body
      const { id } = req.params
      const updatedBy = req.session.user._id,
        updatedByOnModel = req.session.onModel
      const department = await Departments.findByIdAndUpdate(id, {
        $set: {
          title,
          description,
          code,
          updatedBy,
          updatedByOnModel,
        },
      })
      if (!department) throw new CustomError("NOT_FOUND", "No record found.")
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record updated successfully",
      })
    },
    delete: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { id } = req.params
      const deletedRecord = await Departments.findByIdAndDelete(id)
      if (!deletedRecord) throw new CustomError("NOT_FOUND", "No record found.")
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record deleted successfully",
      })
    },
  }
}
