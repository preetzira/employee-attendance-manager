const mongoose = require("mongoose")
const leaveSchema = mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveType",
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
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

leaveSchema.index({ employee: 1, leaveType: 1 }, { unique: true })

module.exports = mongoose.model("Leave", leaveSchema)
