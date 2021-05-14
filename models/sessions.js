const mongoose = require("mongoose")
const sessionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "onModel",
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Admin", "Employee"],
    },
    deviceOs: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    expiresAt: {
      type: Date,
      /* Defaults 7 days from now */
      default: new Date(Date.now() + +process.env.TOKEN_EXPIRATION_TIME),
      /* Remove doc 60 seconds after specified date */
      expires: 60,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Session", sessionSchema)
