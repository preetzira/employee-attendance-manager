const mongoose = require("mongoose")
const leaveApplicationSchema = mongoose.Schema(
  {
    leaveType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "LeaveType",
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    appliedLeavesCount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
    },
    cancellationReason: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "approvedByOnModel",
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "cancelledByOnModel",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Employee",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Employee",
    },
    approvedByOnModel: {
      type: String,
      enum: ["Admin", "Employee"],
    },
    cancelledByOnModel: {
      type: String,
      enum: ["Admin", "Employee"],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("LeaveApplication", leaveApplicationSchema)
