require("dotenv").config()
const API_VERSION = process.env.API_VERSION || "v1"
const express = require("express")
const http = require("http")
const multer = require("multer")
const helmet = require("helmet")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const upload = multer()
const httpLogger = require("./middlewares/httpLogger")
const AccessLogger = require("./middlewares/accessLogger")
const globalErrorHandler = require("./middlewares/errorHandler")
const logger = require("./utils/logger")
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./utils/swagger")
const {
  departmentsRouter,
  designationsRouter,
  leavesRouter,
  leaveTypesRouter,
  leaveApplicationsRouter,
  holidaysRouter,
  employeesRouter,
  attendanceRouter,
  adminRouter,
} = require("./routes")
require("./services/connectDatabase")
const authMiddleware = require("./middlewares/authentication")

const port = process.env.PORT || 8000
const app = express()

const accessLogs = new AccessLogger(10, 3000)

app.use(function (req, res, next) {
  if (!accessLogs.check(req.ip)) {
    logger.error(` ${req.ip} exceeded the request threshold limit!`)
    res.status(403).end("You have exceeded the request threshold limit!")
  } else {
    next()
  }
})

app.use(helmet())
app.use(cors())
app.use(upload.array())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SECRET_KEY))
app.use(httpLogger)
app.use(authMiddleware)

app.use(`/${API_VERSION}/admin`, adminRouter)
app.use(`/${API_VERSION}/employee`, employeesRouter)
app.use(`/${API_VERSION}/attendance`, attendanceRouter)
app.use(`/${API_VERSION}/department`, departmentsRouter)
app.use(`/${API_VERSION}/designation`, designationsRouter)
app.use(`/${API_VERSION}/leave`, leavesRouter)
app.use(`/${API_VERSION}/leave_type`, leaveTypesRouter)
app.use(`/${API_VERSION}/leave_application`, leaveApplicationsRouter)
app.use(`/${API_VERSION}/holiday`, holidaysRouter)

app.use(globalErrorHandler)

app.use(
  `/${API_VERSION}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
)

app.all("*", (req, res) => {
  res.status(404).send({
    success: false,
    status: 404,
    message: `Can't find ${req.originalUrl} on this server!`,
  })
})

process.on("uncaughtException", function (error, origin) {
  logger.error(`message - ${error.message}, stack trace - ${error.stack}`)
})

process.on("SIGTERM", () => {
  logger.info(`SIGTERM signal received: closing HTTP server`)
  app.close(() => {
    logger.info("HTTP server closed")
  })
})

http
  .createServer(app)
  .listen(port, () => logger.info(`listening to port ${port}`))
