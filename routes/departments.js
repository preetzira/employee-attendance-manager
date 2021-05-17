const router = require("express").Router()
const DepartmentController = require("../controllers/departments")()
const asyncHandlerMiddleware = require("../utils/asyncHandlerMiddleware")
const { departmentRoutes } = require("./CONSTANTS")

/**
 * @swagger
 * /department/list:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: List all departments.
 *     tags:
 *      - Department
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/DesignationOrDepartmentOrLeaveTypeResponseObject'
 *
 * /department/create:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: Create a department.
 *     tags:
 *      - Department
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
 * /department/{id}:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: View details of a department.
 *     tags:
 *      - Department
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Department's `_id` of the record to be viewed.
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                 $ref: '#/components/schemas/DesignationOrDepartmentOrLeaveTypeResponseObject'
 *   put:
 *     security:
 *      - BearerAuth: []
 *     description: Update a department.
 *     tags:
 *      - Department
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Department's `_id` of the record to be updated. HR/Admin only.
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
 *      - Department
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: Department's `_id` of the record to be deleted. HR/Admin only.
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteSuccessResponseObject'
 *
 */
departmentRoutes.forEach((route) => {
  router[route.method](
    route.path,
    asyncHandlerMiddleware(DepartmentController[route.controller]),
  )
})

module.exports = router
