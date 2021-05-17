const router = require("express").Router()
const DesignationController = require("../controllers/Designations")()
const asyncHandlerMiddleware = require("../utils/asyncHandlerMiddleware")
const { designationRoutes } = require("./CONSTANTS")

/**
 * @swagger
 * /designation/list:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: List all designations.
 *     tags:
 *      - Designation
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DesignationOrDepartmentOrLeaveTypeResponseObject'
 *
 * /designation/create:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: Create a designation.
 *     tags:
 *      - Designation
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
 * /designation/{id}:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: View details of a designation.
 *     tags:
 *      - Designation
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Designation's `_id` of the record to be viewed.
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
 *     description: Update a designation.
 *     tags:
 *      - Designation
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Designation's `_id` of the record to be updated. HR/Admin only.
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
 *     description: Deletes a designation.
 *     tags:
 *      - Designation
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Designation's `_id` of the record to be deleted. HR/Admin only.
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteSuccessResponseObject'
 *
 */
designationRoutes.forEach((route) => {
  router[route.method](
    route.path,
    asyncHandlerMiddleware(DesignationController[route.controller]),
  )
})

module.exports = router
