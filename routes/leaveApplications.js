const router = require("express").Router()
const LeaveApplicationsController = require("../controllers/leaveApplications")()
const asyncHandlerMiddleware = require("../utils/asyncHandlerMiddleware")
const { leaveApplicationRoutes } = require("./CONSTANTS")

/**
 * @swagger
 * /leave_application/list:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: List all leave application.
 *     tags:
 *      - LeaveApplication
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveApplicationResponseObject'
 *
 * /leave_application/apply:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: Create an employee.
 *     tags:
 *      - LeaveApplication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplyOrUpdateLeaveApplicationRequestObject'
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSuccessResponseObject'
 *
 * /leave_application/{id}:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: View details of a leave application.
 *     tags:
 *      - LeaveApplication
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: LeaveApplication's `_id` of the record to be viewed.
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveApplicationResponseObject'
 *   put:
 *     security:
 *      - BearerAuth: []
 *     description: Update a leave application.
 *     tags:
 *      - LeaveApplication
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: false
 *        description: LeaveApplication's `_id` of the records to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplyOrUpdateLeaveApplicationRequestObject'
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateSuccessResponseObject'
 *
 * /leave_application/cancel/{id}:
 *   patch:
 *     security:
 *      - BearerAuth: []
 *     description: Cancels a leave application.
 *     tags:
 *      - LeaveApplication
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: LeaveApplication's `_id` of the record to be updated.
 *      - in: body
 *        name: cancellationReason
 *        type: string
 *        description: Reason for cancelling the leave application.
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateSuccessResponseObject'
 *
 * /leave_application/approve/{id}:
 *   patch:
 *     security:
 *      - BearerAuth: []
 *     description: Approves a leave application.
 *     tags:
 *      - LeaveApplication
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: LeaveApplication's `_id` of the records to be updated.
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateSuccessResponseObject'
 */
leaveApplicationRoutes.forEach((route) => {
  router[route.method](
    route.path,
    asyncHandlerMiddleware(LeaveApplicationsController[route.controller]),
  )
})

module.exports = router
