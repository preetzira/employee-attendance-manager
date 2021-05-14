const validateEmail = function (email) {
  const regExp = new RegExp(
    /^[A-Z0-9._%+-]+@[A-Z0-9!*#$&%{}|~()-`+,/]+\.[A-Z0-9]{1,20}$/i,
  )
  return regExp.test(email)
}

const validatePassword = function (password) {
  const regExp = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
  )
  return regExp.test(password)
}

module.exports = {
  validateEmail,
  validatePassword,
}
