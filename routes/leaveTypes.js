const router = require("express").Router()
const LeaveTypesController = require("../controllers/leaveTypes")()
const asyncHandlerMiddleware = require("../utils/asyncHandlerMiddleware")
const { leaveTypeRoutes } = require("./CONSTANTS")

/**
 * @swagger
 * /leave_type/list:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: List all leave types.
 *     tags:
 *      - LeaveType
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DesignationOrDepartmentOrLeaveTypeResponseObject'
 *
 * /leave_type/create:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: Create a leave type.
 *     tags:
 *      - LeaveType
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrUpdateDepartmentOrDesignationOrLeaveTypeRequestObject'
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSuccessResponseObject'
 *
 * /leave_type/{id}:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: View details of a leave type.
 *     tags:
 *      - LeaveType
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: LeaveType's `_id` of the record to be viewed.
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                 $ref: '#/components/schemas/DesignationOrDepartmentOrLeaveTypeResponseObject'
 *
 *   put:
 *     security:
 *      - BearerAuth: []
 *     description: Update a leave type.
 *     tags:
 *      - LeaveType
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: LeaveType's `_id` of the record to be updated. HR/Admin only.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrUpdateDepartmentOrDesignationOrLeaveTypeRequestObject'
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
 *     description: Deletes a leave type.
 *     tags:
 *      - LeaveType
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: LeaveType's `_id` of the record to be deleted. HR/Admin only.
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteSuccessResponseObject'
 *
 */
leaveTypeRoutes.forEach((route) => {
  router[route.method](
    route.path,
    asyncHandlerMiddleware(LeaveTypesController[route.controller]),
  )
})

module.exports = router
