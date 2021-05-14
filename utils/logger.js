const { createLogger, transports, format } = require("winston")
require("winston-daily-rotate-file")

const transportsArray = [
  // new transports.File({
  //   filename: `./logs/${new Date().toISOString().substr(0,10)}.log`,
  //   json: false,
  //   maxsize: 5242880,
  //   maxFiles: 35,
  // }),
  new transports.DailyRotateFile({
    datePattern: "YYYY-MM-DD-HH",
    filename: "logs/error",
    extension: ".log",
    level: "error",
    maxsize: "10m",
    maxFiles: "35d",
  }),
  new transports.DailyRotateFile({
    datePattern: "YYYY-MM-DD-HH",
    filename: "logs/all",
    extension: ".log",
    level: "debug",
    maxsize: "20m",
    maxFiles: "5d",
  }),
  new transports.Console(),
]

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    format.printf(
      (info) => `${info.timestamp}::${info.level}::${info.message}`,
    ),
  ),
  // level: "info",
  // format: format.logstash(),
  // defaultMeta: {
  //     service: 'user-service'
  // },
  transports: transportsArray,
})

module.exports = logger
