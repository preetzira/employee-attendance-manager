const router = require("express").Router()
const HolidaysController = require("../controllers/holidays")()
const asyncHandlerMiddleware = require("../utils/asyncHandlerMiddleware")
const { holidayRoutes } = require("./CONSTANTS")

/**
 * @swagger
 * /holiday/list:
 *   get:
 *     description: List all holidays.
 *     tags:
 *      - Holiday
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HolidayResponseObject'
 *
 * /holiday/create:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: Create a holiday.
 *     tags:
 *      - Holiday
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrUpdateHolidayRequestObject'
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSuccessResponseObject'
 *
 * /holiday/{id}:
 *   get:
 *     description: View details of a holiday.
 *     tags:
 *      - Holiday
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: ID of the record to be viewed.
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                 $ref: '#/components/schemas/HolidayResponseObject'
 *
 *   put:
 *     security:
 *      - BearerAuth: []
 *     description: Update a holiday.
 *     tags:
 *      - Holiday
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: ID of the record to be updated. HR/Admin only.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrUpdateHolidayRequestObject'
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateSuccessResponseObject'
 *   delete:
 *     security:
 *      - BearerAuth: []
 *     description: Deletes a holiday.
 *     tags:
 *      - Holiday
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: ID of the record to be deleted. HR/Admin only.
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteSuccessResponseObject'
 *
 */
holidayRoutes.forEach((route) => {
  router[route.method](
    route.path,
    asyncHandlerMiddleware(HolidaysController[route.controller]),
  )
})

module.exports = router
