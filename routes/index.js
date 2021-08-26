const departmentsRouter = require("./departments")
const designationsRouter = require("./designations")
const leavesRouter = require("./leaves")
const leaveTypesRouter = require("./leaveTypes")
const leaveApplicationsRouter = require("./leaveApplications")
const holidaysRouter = require("./holidays")
const employeesRouter = require("./employees")
const attendanceRouter = require("./attendance")
const adminRouter = require("./admin")
const pushNotificationRouter = require("./pushNotification")

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BasicAuth:
 *       type: http
 *       scheme: basic
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-Key
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         flag:
 *           type: integer
 *           value:
 *             oneOf:
 *               - 500
 *               - 400
 *               - 404
 *               - 403
 *           default: 404
 *         success:
 *           type: boolean
 *           default: false
 *         error:
 *           type: string
 *       required:
 *         - flag
 *         - success
 *         - error
 *
 *     LoginRequestObject:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Email address of user.
 *           example: user@example.com
 *         password:
 *           type: string
 *           description: Password of the user.
 *           example: "***********"
 *
 *     ResetPasswordSuccessResponseObject:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           value: Password reset link has been sent to your email
 *
 *     CreateOrUpdateEmployeeRequestObject:
 *       type: object
 *       properties:
 *         fullname:
 *           type: string
 *           description: Full name of user.
 *           example: Hell Cracker
 *         gender:
 *           type: string
 *           description: Gender of user.
 *           example: Male
 *         dateOfBirth:
 *           type: string
 *           description: Date of birth of user.
 *           example: 1996-06-03
 *         email:
 *           type: string
 *           description: Email address of user. HR/Admin only
 *           example: user@example.com
 *         password:
 *           type: string
 *           description: Password of the user. Optional for HR/Admin on update.
 *           example: "***********"
 *         code:
 *           type: number
 *           description: Password of the user. HR/Admin only
 *           example: 23
 *         currentAddress:
 *           type: string
 *           description: Current address of user.
 *           example: 106 west, GB road, California
 *         permanentAddress:
 *           type: string
 *           description: Permanent address of user.
 *           example: 706/15, Talwandi road, Zira, Punjab
 *         phone:
 *           type: string
 *           description: Phone number of the user.
 *           example: 0000000000
 *         personalEmail:
 *           type: string
 *           description: Personal email address of user.
 *           example: userpersonal@example.com
 *         joinedOn:
 *           type: string
 *           description: Joining date of the user. HR/Admin only
 *           example: 2021-04-05T11:43:34.440Z
 *         reportsTo:
 *           type: string
 *           description:  Unique id of the employee user reports to. HR/Admin only
 *           example: 606b01fa86c8951d90dbf453
 *         designation:
 *           type: string
 *           description: Unique id of the designation. HR/Admin only
 *           example: 606c46b4a3f70035409abfc6
 *         department:
 *           type: string
 *           description: Unique id of the department. HR/Admin only
 *           example: 606c54c52329aa43a4096304
 *         profileImage:
 *           type: string
 *           description: URL of the profile picture image.
 *           example: https://imgur.com/4dx9pf
 *
 *     ChangePasswordRequestObject:
 *         type: object
 *         properties:
 *           currentPassword:
 *             type: string
 *             description: Current password of user. Optional in case of updation by HR/Admin.
 *             example: "********"
 *           newPassword:
 *             type: string
 *             required: true
 *             description: New password to be set.
 *             example: "***********"
 *           confirmNewPassword:
 *             type: string
 *             required: true
 *             description: Confirm new password.
 *             example: "***********"
 *
 *     CreateOrUpdateLeaveRequestObject:
 *         type: object
 *         properties:
 *           employee:
 *             type: string
 *             description: ID of the employee to.
 *             example: 606c54c52329aa43a4096304
 *           leaveType:
 *             type: string
 *             required: true
 *             description: ID of the leave type.
 *             example: 606c54c52329aa43a4096304
 *           count:
 *             type: number
 *             required: true
 *             description: Number of leaves to be assigned for given leave type.
 *             example: 5
 *
 *     CreateOrUpdateDepartmentOrDesignationOrLeaveTypeRequestObject:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the entity.
 *           example: Human resource / Associate Developer / Earned leave
 *         description:
 *           type: string
 *           required: true
 *           description: Description about the entity.
 *           example: Write something about the entity you are creating right now.
 *         code:
 *           type: string
 *           required: true
 *           description: Unique code for the entity.
 *           example: HR / AD / EL
 *
 *     ApplyOrUpdateLeaveApplicationRequestObject:
 *       type: object
 *       properties:
 *         leaveType:
 *           type: string
 *           required: true
 *           description: ID of the leave type user applying to.
 *           example: 606c54c52329aa43a4096304
 *         fromDate:
 *           type: string
 *           required: true
 *           format: date
 *           description: Date from which the leave application is applicable.
 *           example: 2021-04-05T00:00:00.000Z
 *         toDate:
 *           type: string
 *           required: false
 *           format: date
 *           description: Date to which the leave application is applicable.
 *           example: 2021-04-08T00:00:00.000Z
 *         reason:
 *           type: string
 *           required: true
 *           description: Reason for applying the leave application
 *           example: Wedding ceremony
 *
 *     CreateOrUpdateHolidayRequestObject:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the holiday.
 *           example: Easter egg
 *         description:
 *           type: string
 *           required: true
 *           description: Description about the Holiday.
 *           example: Easter, also called Pascha (Aramaic, Greek, Latin) or Resurrection Sunday, is a Christian festival and cultural holiday commemorating the resurrection of Jesus.
 *         fromDate:
 *           type: string
 *           required: true
 *           format: date
 *           description: Date from which the holiday will start.
 *           example: 2021-04-04T00:00:00.000Z
 *         toDate:
 *           type: string
 *           required: true
 *           format: date
 *           description: Date to which the holiday will end.
 *           example: 2021-04-04T23:59:59.000Z
 *
 *     DesignationOrDepartmentOrLeaveTypeResponseObject:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         code:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date
 *         updatedAt:
 *           type: string
 *           format: date
 *
 *     HolidayResponseObject:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         fromDate:
 *           type: string
 *           format: date
 *         toDate:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *           format: date
 *         updatedAt:
 *           type: string
 *           format: date
 *         createdBy:
 *           type: object
 *           properties:
 *             fullname:
 *               type: string
 *             code:
 *               type: string
 *         updatedBy:
 *           type: object
 *           properties:
 *             fullname:
 *               type: string
 *             code:
 *               type: string
 *
 *     AttendanceResponseObject:
 *       type: object
 *       properties:
 *         isAbsent:
 *           type: boolean
 *         isOnLeave:
 *           type: boolean
 *         employee:
 *           type: object
 *         in:
 *           type: object
 *           required: false
 *         out:
 *           type: object
 *           required: false
 *         createdAt:
 *           type: string
 *           format: date
 *         createdBy:
 *           type: object
 *         createdByOnModel:
 *           type: string
 *         updatedAt:
 *           type: string
 *           format: date
 *         updatedBy:
 *           type: object
 *         updatedByOnModel:
 *           type: string
 *
 *     LeaveApplicationResponseObject:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         isApproved:
 *           type: boolean
 *         isCancelled:
 *           type: boolean
 *         leaveType:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             code:
 *               type: string
 *         fromDate:
 *           type: string
 *           format: date
 *         toDate:
 *           type: string
 *           format: date
 *         appliedLeavesCount:
 *           type: number
 *         reason:
 *           type: string
 *         createdBy:
 *           type: object
 *           properties:
 *             fullname:
 *               type: string
 *             code:
 *               type: string
 *             leaves:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: string
 *                   _id:
 *                     type: string
 *                   leaveType:
 *                     type: string
 *         updatedBy:
 *           type: object
 *           properties:
 *             fullname:
 *               type: string
 *             code:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date
 *         updatedAt:
 *           type: string
 *           format: date
 *         approvedBy:
 *           type: object
 *           properties:
 *             fullname:
 *               type: string
 *             code:
 *               type: string
 *         cancelledBy:
 *           type: object
 *           properties:
 *             fullname:
 *               type: string
 *             code:
 *               type: string
 *         approvedByOnModel:
 *           type: string
 *         cancelledByOnModel:
 *           type: string
 *
 *     LeaveResponseObject:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         count:
 *           type: number
 *         employee:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             fullname:
 *               type: string
 *             email:
 *               type: string
 *             code:
 *               type: string
 *         leaveType:
 *           type: object
 *           properties:
 *             _id:
 *              type: string
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             code:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date
 *         createdBy:
 *           type: object
 *           properties:
 *             fullname:
 *               type: string
 *             email:
 *               type: string
 *             code:
 *               type: string
 *         createdByOnModel:
 *           type: string
 *         updatedAt:
 *           type: string
 *           format: date
 *         updatedBy:
 *           type: object
 *           properties:
 *             fullname:
 *               type: string
 *             email:
 *               type: string
 *             code:
 *               type: string
 *         updatedByOnModel:
 *           type: string
 *
 *     EmployeeResponseObject:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         leaves:
 *           type: array
 *           items:
 *             type: object
 *         emailVerified:
 *           type: boolean
 *         phoneVerified:
 *           type: boolean
 *         isDeleted:
 *           type: boolean
 *         profileImage:
 *           type: string
 *         fullname:
 *           type: string
 *         email:
 *           type: string
 *         gender:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *         permanentAddress:
 *           type: string
 *         code:
 *           type: string
 *         currentAddress:
 *           type: string
 *         phone:
 *           type: string
 *         personalEmail:
 *           type: string
 *         joinedOn:
 *           type: string
 *         reportsTo:
 *           type: object
 *         designation:
 *           type: object
 *         department:
 *           type: object
 *         createdByOnModel:
 *           type: string
 *         updatedByOnModel:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date
 *         updatedAt:
 *           type: string
 *           format: date
 *
 *     LoginSuccessResponseObject:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: The access token for the user.
 *         expiresIn:
 *           type: integer
 *           description: The expiration time of the token.
 *           example: 3600
 *
 *     PushNotificationPayloadObject:
 *       type: object
 *       properties:
 *         payload:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: Test
 *
 *     PushNotificationSubscribeRequestObject:
 *       type: object
 *       properties:
 *         subscription:
 *           type: object
 *           properties:
 *             endpoint:
 *               type: string
 *               example: https://updates.push.services.mozilla.com/wpush/v2/gAAAAABgoemO5shIBW5cfqsW8BZR3C7TReUqEntK8oFoN1FhFkoIXthIYG6Yfg_bXtlfrTga4dxQ3bWphYjoIzQ3P15VjZNEM4qR4OYfKONy1fVXkSZs5Prj_XH7GcfITK-LwH2hDHNJ4mvFNCKXNtANrofwR9AYD9iM1Ne6pANOusjPGvioMPg
 *             keys:
 *               type: object
 *               properties:
 *                 auth:
 *                   type: string
 *                   example: eDY4SZwJnj0OUYYgo6awng
 *                 p256dh:
 *                   type: string
 *                   example: BF_yB_IU-j7gvzFCrPCs5BwfzPUfP0zE4__TpkhJRVqVZ9OT4sQ8MuDBPAwhq2jl_O5WfHTOCvb1vNZdTJ0qyV8
 *         platform:
 *           type: object
 *           properties:
 *             os:
 *               type: string
 *               example: Window 10 pro
 *             osVersion:
 *               type: string
 *               example: 20H2
 *             browser:
 *               type: string
 *               example: Firefox
 *             browserVersion:
 *               type: string
 *               example: 77.0
 *             device:
 *               type: string
 *               example: iPad
 *             deviceManufacturer:
 *               type: string
 *               example: Apple
 *             layout:
 *               type: string
 *               example: WebKit
 *
 *     PushNotificationResponseObject:
 *       type: object
 *       properties:
 *         subscription:
 *           type: object
 *           properties:
 *             endpoint:
 *               type: string
 *               example: https://updates.push.services.mozilla.com/wpush/v2/gAAAAABgoemO5shIBW5cfqsW8BZR3C7TReUqEntK8oFoN1FhFkoIXthIYG6Yfg_bXtlfrTga4dxQ3bWphYjoIzQ3P15VjZNEM4qR4OYfKONy1fVXkSZs5Prj_XH7GcfITK-LwH2hDHNJ4mvFNCKXNtANrofwR9AYD9iM1Ne6pANOusjPGvioMPg
 *             keys:
 *               type: object
 *               properties:
 *                 auth:
 *                   type: string
 *                   example: eDY4SZwJnj0OUYYgo6awng
 *                 p256dh:
 *                   type: string
 *                   example: BF_yB_IU-j7gvzFCrPCs5BwfzPUfP0zE4__TpkhJRVqVZ9OT4sQ8MuDBPAwhq2jl_O5WfHTOCvb1vNZdTJ0qyV8
 *         isActive:
 *           type: boolean
 *           example: false
 *         createdBy:
 *           type: object
 *         onModel:
 *           type: string
 *           value:
 *             oneOf:
 *               - Admin
 *               - Employee
 *
 *     EmailVerifySuccessResponseObject:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Email verified successfully.
 *
 *     EmailVerifyErrorResponseObject:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Verification token is either invalid or expired.
 *
 *     CreateSuccessResponseObject:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Record created successfully.
 *         status:
 *           type: integer
 *           value: 201
 *         success:
 *           type: boolean
 *           value: true
 *
 *     UpdateSuccessResponseObject:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Record updated successfully.
 *         status:
 *           type: integer
 *           value: 200
 *         success:
 *           type: boolean
 *           value: true
 *
 *     DeleteSuccessResponseObject:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Record deleted successfully.
 *         status:
 *           type: integer
 *           value: 200
 *         success:
 *           type: boolean
 *           value: true
 */

module.exports = {
  departmentsRouter,
  designationsRouter,
  leavesRouter,
  leaveTypesRouter,
  leaveApplicationsRouter,
  holidaysRouter,
  employeesRouter,
  attendanceRouter,
  adminRouter,
  pushNotificationRouter,
}
