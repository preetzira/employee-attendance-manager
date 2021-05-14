const swaggerJSDoc = require("swagger-jsdoc")

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for Attendance Manager",
    version: "1.0.0",
    description:
      "This is a employee attendance management application built on Express.",
    //   license: {
    //     name: 'Not licensed',
    //     url: 'https://spdx.org/licenses/MIT.html',
    //   },
    contact: {
      name: "ABC",
      url: "http://www.google.com",
    },
  },
  servers: [
    {
      url: "http://localhost:8000/v1/",
      description: "Development server",
    },
  ],
}

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
}

module.exports = swaggerJSDoc(options)
