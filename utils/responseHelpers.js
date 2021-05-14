const errorResponse = (responseObject, flag, err) => {
  return responseObject.status(flag).send({
    status: flag,
    success: false,
    error: err.message,
  })
}

const successResponse = (responseObject, flag, data) => {
  return responseObject.status(flag).send({
    status: flag,
    success: true,
    data,
  })
}

module.exports = {
  errorResponse,
  successResponse,
}
