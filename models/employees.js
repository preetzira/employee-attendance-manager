const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { validateEmail } = require("../utils/validators")

const employeeSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Transgender"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^[A-Z0-9._%+-]+@[A-Z0-9!*#$&%{}|~()-`+,/]+\.[A-Z0-9]{1,20}$/i,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    code: {
      type: Number,
      unique: true,
      required: true,
    },
    currentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    personalEmail: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^[A-Z0-9._%+-]+@[A-Z0-9!*#$&%{}|~()-`+,/]+\.[A-Z0-9]{1,20}$/i,
        "Please fill a valid email address",
      ],
    },
    joinedOn: {
      type: Date,
      required: true,
    },
    reportsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    leaves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Leave",
      },
    ],
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Designation",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Department",
    },
    profileImage: {
      type: String,
      default: "user.png",
    },
    tokens: new mongoose.Schema({
      emailVerificationToken: {
        type: String,
        required: true,
      },
      resetPasswordToken: {
        type: String,
        required: false,
      },
      emailVerificationTokenExpiresAt: {
        type: Date,
        default: new Date(),
      },
      resetPasswordTokenExpiresAt: {
        type: Date,
        default: new Date(),
      },
    }),
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

employeeSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next()
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10))
  next()
})

employeeSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model("Employee", employeeSchema)
