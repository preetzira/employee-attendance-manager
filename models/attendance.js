const mongoose = require("mongoose")
const attendanceSchema = mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Employee",
    },
    in: {
      type: Object,
      time: {
        type: Date,
        required: true,
      },
      remarks: {
        type: String,
      },
    },
    out: {
      type: Object,
      time: {
        type: Date,
        required: true,
      },
      remarks: {
        type: String,
      },
    },
    isAbsent: {
      type: Boolean,
      default: false,
    },
    isOnLeave: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("Attendance", attendanceSchema)
