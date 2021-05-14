const router = require("express").Router()
const EmployeesController = require("../controllers/employees")()
const asyncHandlerMiddleware = require("../utils/asyncHandlerMiddleware")
const { employeeRoutes } = require("./CONSTANTS")

/**
 * @swagger
 * /employee/list:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: List all employees.
 *     tags:
 *      - Employee
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EmployeeResponseObject'
 *
 * /employee/login:
 *   post:
 *     description: Login a user.
 *     tags:
 *      - Employee
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
 *
 * /employee/create:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: Create an employee.
 *     tags:
 *      - Employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrUpdateEmployeeRequestObject'
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSuccessResponseObject'
 *
 * /employee/change_password/{employeeId}:
 *   put:
 *     security:
 *      - BearerAuth: []
 *     description: Change password of employee.
 *     tags:
 *      - Employee
 *     parameters:
 *      - in: path
 *        name: employeeId
 *        type: string
 *        required: false
 *        description: ID of the record to change password for. HR/Admin only.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequestObject'
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateSuccessResponseObject'
 *
 * /employee/resend_verification_email:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: Request to send a verification email again.
 *     tags:
 *      - Employee
 *     responses:
 *       200:
 *         type: object
 *         properties:
 *           message:
 *             type: string
 *             description: Verification email sent successfully.
 *
 * /employee/verify_email/{token}:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: Create an employee.
 *     tags:
 *      - Employee
 *     parameters:
 *      - in: path
 *        name: token
 *        type: string
 *        required: true
 *        description: Token to verify user email.
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailVerifySuccessResponseObject'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailVerifyErrorResponseObject'
 *
 * /employee/reset_password:
 *   post:
 *     description: Request to send a reset password mail.
 *     tags:
 *      - Employee
 *     requestBody:
 *       required: true
 *       content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  required: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordSuccessResponseObject'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /employee/reset_password/{token}:
 *   post:
 *     description: Reset the password.
 *     tags:
 *      - Employee
 *     parameters:
 *      - in: path
 *        name: token
 *        type: string
 *        description: Reset password token.
 *        example: 7a98e784ec9c
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequestObject'
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateSuccessResponseObject'
 *
 * /employee/{employeeId}:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: View details of an employee.
 *     tags:
 *      - Employee
 *     parameters:
 *      - in: path
 *        name: employeeId
 *        type: string
 *        required: false
 *        description: ID of the record to be viewed. HR/Admin only.
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponseObject'
 *
 *   put:
 *     security:
 *      - BearerAuth: []
 *     description: Update an employee.
 *     tags:
 *      - Employee
 *     parameters:
 *      - in: path
 *        name: employeeId
 *        type: string
 *        required: false
 *        description: ID of the record to be updated. HR/Admin only.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrUpdateEmployeeRequestObject'
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
 *     description: Deletes an employee.
 *     tags:
 *      - Employee
 *     parameters:
 *      - in: path
 *        name: employeeId
 *        type: string
 *        required: true
 *        description: ID of the records to be deleted. HR/Admin only.
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteSuccessResponseObject'
 *
 */
employeeRoutes.forEach((route) => {
  router[route.method](
    route.path,
    asyncHandlerMiddleware(EmployeesController[route.controller]),
  )
})

module.exports = router
