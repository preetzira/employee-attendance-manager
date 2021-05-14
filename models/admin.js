const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { validateEmail } = require("../utils/validators")

const adminSchema = mongoose.Schema({
  fullname: {
    type: String,
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
  },
  profileImage: {
    type: String,
    default: "user.png",
  },
})

adminSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next()
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10))
  next()
})

adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model("Admin", adminSchema, "admin")
