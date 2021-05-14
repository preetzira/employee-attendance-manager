const Designations = require("../models/designations")
const { responseFlags, CustomError } = require("../utils/constants")
const { successResponse } = require("../utils/responseHelpers")

module.exports = function () {
  return {
    list: async function (req, res) {
      const designations = await Designations.find(
        {},
        "title description code createdAt updatedAt",
      )
      return successResponse(res, responseFlags.SUCCESS, {
        designations,
      })
    },
    create: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { title, description, code } = req.body
      const createdBy = req.session.user._id,
        createdByOnModel = req.session.onModel
      await Designations.create({
        title,
        description,
        code,
        createdBy,
        updatedBy: createdByOnModel,
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
      const designation = await Designations.findById(
        id,
        "title description code createdAt updatedAt",
      )
      return successResponse(res, responseFlags.SUCCESS, designation)
    },
    update: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { title, description, code } = req.body
      const { id } = req.params
      const updatedBy = req.session.user._id,
        updatedByOnModel = req.session.onModel
      const designation = await Designations.findByIdAndUpdate(id, {
        $set: {
          title,
          description,
          code,
          updatedBy,
          updatedByOnModel,
        },
      })
      if (!designation) throw new CustomError("NOT_FOUND", "No record found.")
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record updated successfully",
        status: 200,
      })
    },
    delete: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { id } = req.params
      const deletedRecord = await Designations.findByIdAndDelete(id)
      if (!deletedRecord) throw new CustomError("NOT_FOUND", "No record found.")
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record deleted successfully",
        status: 200,
      })
    },
  }
}
