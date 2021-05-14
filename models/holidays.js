const mongoose = require("mongoose")
const holidaySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
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

module.exports = mongoose.model("Holiday", holidaySchema)
