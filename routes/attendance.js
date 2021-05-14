const router = require("express").Router()
const AttendanceController = require("../controllers/attendance")()
const asyncHandlerMiddleware = require("../utils/asyncHandlerMiddleware")
const { attendanceRoutes } = require("./CONSTANTS")

/**
 * @swagger
 * /attendance/list:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: List attendances.
 *     tags:
 *      - Attendance
 *     parameters:
 *      - in: query
 *        name: employeeId
 *        type: string
 *        required: false
 *        description: ID of employee to fetch attendance of. HR/Admin only.
 *        example: 606c54c52329aa43a4096304
 *      - in: query
 *        name: from
 *        type: string
 *        required: false
 *        description: Date from which records to be fetched.
 *        example: 2021-04-05T00:00:00.000Z
 *      - in: query
 *        name: to
 *        type: string
 *        required: false
 *        description: Date till which records to be fetched.
 *        example: 2021-04-12T00:00:00.000Z
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AttendanceResponseObject'
 *
 * /attendance/{id}:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: View details of an attendance.
 *     tags:
 *      - Attendance
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
 *             schema:
 *               $ref: '#/components/schemas/AttendanceResponseObject'
 *
 * /attendance/in:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: In time attendance mark.
 *     tags:
 *      - Attendance
 *     requestBody:
 *       required: true
 *       content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                remarks:
 *                  type: string
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSuccessResponseObject'
 *
 * /attendance/out:
 *   put:
 *     security:
 *      - BearerAuth: []
 *     description: Out time attendance mark.
 *     tags:
 *      - Attendance
 *     requestBody:
 *       required: true
 *       content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                remarks:
 *                  type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateSuccessResponseObject'
 *
 * /attendance/mark_absent:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: Mark an employee absent.
 *     tags:
 *      - Attendance
 *     requestBody:
 *       required: true
 *       content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                employeeId:
 *                  type: string
 *                  required: true
 *                  description: ID of the employee to be marked absent.
 *                  example: 606d60720dcabc3d843a923e
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSuccessResponseObject'
 *
 * /attendance/mark_on_leave:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: Mark an employee on leave.
 *     tags:
 *      - Attendance
 *     requestBody:
 *       required: true
 *       content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                employeeId:
 *                  type: string
 *                  required: true
 *                  description: ID of the employee to be marked on leave.
 *                  example: 606d60720dcabc3d843a923e
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSuccessResponseObject'
 *
 */
attendanceRoutes.forEach((route) => {
  router[route.method](
    route.path,
    asyncHandlerMiddleware(AttendanceController[route.controller]),
  )
})

module.exports = router
