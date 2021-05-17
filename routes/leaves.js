const router = require("express").Router()
const LeavesController = require("../controllers/leaves")()
const asyncHandlerMiddleware = require("../utils/asyncHandlerMiddleware")
const { leaveRoutes } = require("./CONSTANTS")

/**
 * @swagger
 * /leave/list/{employeeId}:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: List all leaves.
 *     tags:
 *      - Leave
 *     parameters:
 *      - in: path
 *        name: employeeId
 *        type: string
 *        description: Leaves's `_id` of the employee whose leaves to be viewed.
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeaveResponseObject'
 *
 * /leave/create:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: Create a leave for an employee.
 *     tags:
 *      - Leave
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrUpdateLeaveRequestObject'
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSuccessResponseObject'
 *
 * /leave/{id}:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: View details of a leave of an employee.
 *     tags:
 *      - Leave
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Leaves's `_id` of the record to be viewed.
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/LeaveResponseObject'
 *
 *   put:
 *     security:
 *      - BearerAuth: []
 *     description: Update a leave.
 *     tags:
 *      - Leave
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Leaves's `_id` of the record to be updated. HR/Admin only.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrUpdateLeaveRequestObject'
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
 *     description: Deletes a leave.
 *     tags:
 *      - Leave
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Leaves's `_id` of the record to be deleted. HR/Admin only.
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteSuccessResponseObject'
 *
 */
leaveRoutes.forEach((route) => {
  router[route.method](
    route.path,
    asyncHandlerMiddleware(LeavesController[route.controller]),
  )
})

module.exports = router
