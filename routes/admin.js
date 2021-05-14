const router = require("express").Router()
const AdminController = require("../controllers/admin")()
const asyncHandlerMiddleware = require("../utils/asyncHandlerMiddleware")
const { adminRoutes } = require("./CONSTANTS")

/**
 * @swagger
 * /admin/login:
 *   post:
 *     description: Login admin user.
 *     tags:
 *      - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequestObject'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginSuccessResponseObject'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
adminRoutes.forEach((route) => {
  router[route.method](
    route.path,
    asyncHandlerMiddleware(AdminController[route.controller]),
  )
})

module.exports = router
