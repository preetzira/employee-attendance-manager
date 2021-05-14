const mongoose = require("mongoose")
const departmentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      // enum: ["DEV", "HR", "SALES"],
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "createdByOnModel",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "updatedByOnModel",
    },
    createdByOnModel: {
      type: String,
      required: true,
      enum: ["Admin", "Employee"],
    },
    updatedByOnModel: {
      type: String,
      required: true,
      enum: ["Admin", "Employee"],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Department", departmentSchema)
