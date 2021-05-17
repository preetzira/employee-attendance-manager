const mongoose = require("mongoose")
const pushNotificationSchema = mongoose.Schema(
  {
    subscription:{
      type: Object,
      required:true,
      endpoint:String,
      keys:{
        type: Object,
        auth: String,
        p256dh: String
      }
    },
    isActive:{
      type: Boolean,
      default: true,
      required: true
    },
    platform:{
      type: Object,
      required: false,
      os: String,
      osVersion: String,
      browser: String,
      browserVersion: String,
      device: String,
      deviceManufacturer: String,
      layout: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "createdByOnModel",
    },
    createdByOnModel: {
      type: String,
      required: true,
      enum: ["Admin", "Employee"],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "updatedByOnModel",
    },
    updatedByOnModel: {
      type: String,
      required: true,
      enum: ["Admin", "Employee"],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("PushNotification", pushNotificationSchema)
