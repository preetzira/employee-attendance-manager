const employeeRoutes = [
  { path: "/list", method: "get", controller: "list" }, //admin or HR
  { path: "/create", method: "post", controller: "create" }, //admin or HR
  { path: "/login", method: "post", controller: "login" }, //emp will login
  { path: "/verify_email/:token", method: "get", controller: "verifyEmail" }, //emp will verify
  {
    path: "/resend_verification_email",
    method: "post",
    controller: "resendEmailVerificationMail",
  }, //emp will request email verification email
  {
    path: "/change_password/:employeeId?",
    method: "put",
    controller: "changePassword",
  }, //emp or admin will change password
  {
    path: "/reset_password/:token",
    method: "post",
    controller: "changePassword",
  }, //emp or admin will change password
  { path: "/reset_password", method: "post", controller: "resetPassword" }, //emp or admin will change password
  { path: "/:employeeId?", method: "get", controller: "view" }, //emp will get details
  { path: "/:employeeId?", method: "put", controller: "update" }, //emp will update
  { path: "/:employeeId", method: "delete", controller: "delete" }, //admin will create
]

const adminRoutes = [
  { path: "/login", method: "post", controller: "login" }, //only admin will perform these actions
  { path: "/change_password", method: "put", controller: "changePassword" }, //only admin will perform these actions
  { path: "/profile", method: "get", controller: "view" }, //only admin will perform these actions
]

const departmentRoutes = [
  { path: "/list", method: "get", controller: "list" }, //only admin will perform these actions for now
  { path: "/create", method: "post", controller: "create" }, //only admin will perform these actions for now
  { path: "/:id", method: "get", controller: "view" }, //only admin will perform these actions for now
  { path: "/:id", method: "put", controller: "update" }, //only admin will perform these actions for now
  { path: "/:id", method: "delete", controller: "delete" }, //only admin will perform these actions for now
]

const designationRoutes = [
  { path: "/list", method: "get", controller: "list" }, //only admin will perform these actions for now
  { path: "/create", method: "post", controller: "create" }, //only admin will perform these actions for now
  { path: "/:id", method: "get", controller: "view" }, //only admin will perform these actions for now
  { path: "/:id", method: "put", controller: "update" }, //only admin will perform these actions for now
  { path: "/:id", method: "delete", controller: "delete" }, //only admin will perform these actions for now
]

const holidayRoutes = [
  { path: "/list", method: "get", controller: "list" }, //only admin will perform these actions for now
  { path: "/create", method: "post", controller: "create" }, //only admin will perform these actions for now
  { path: "/:id", method: "get", controller: "view" }, //only admin will perform these actions for now
  { path: "/:id", method: "put", controller: "update" }, //only admin will perform these actions for now
  { path: "/:id", method: "delete", controller: "delete" }, //only admin will perform these actions for now
]

const leaveTypeRoutes = [
  { path: "/list", method: "get", controller: "list" }, //only admin will perform these actions for now
  { path: "/create", method: "post", controller: "create" }, //only admin will perform these actions for now
  { path: "/:id", method: "get", controller: "view" }, //only admin will perform these actions for now
  { path: "/:id", method: "put", controller: "update" }, //only admin will perform these actions for now
  { path: "/:id", method: "delete", controller: "delete" }, //only admin will perform these actions for now
]

const leaveApplicationRoutes = [
  { path: "/list", method: "get", controller: "list" }, // for employee only
  { path: "/apply", method: "post", controller: "apply" }, // for employee only
  { path: "/:id", method: "get", controller: "view" }, // for employee only
  { path: "/:id", method: "put", controller: "update" }, // for employee only
  { path: "/approve/:id", method: "patch", controller: "approve" }, // for HR/Admin employees
  { path: "/cancel/:id", method: "patch", controller: "cancel" }, // for HR/Admin employees
  // { path: "/:id", method: "delete", controller: "delete" }, // for employee only
]

const leaveRoutes = [
  { path: "/list/:employeeId?", method: "get", controller: "list" }, // for HR employee
  { path: "/create", method: "post", controller: "create" }, // for HR employee
  { path: "/:id", method: "get", controller: "view" }, // for HR employee
  { path: "/:id", method: "put", controller: "update" }, // for HR employee
  { path: "/:id", method: "delete", controller: "delete" }, // for HR employee
  // { path: "/:code", method: "get", controller: "viewForHr" }, // for HR employees
]

const attendanceRoutes = [
  { path: "/list", method: "get", controller: "list" }, // for employees
  { path: "/in", method: "post", controller: "in" }, // for employees
  { path: "/out", method: "put", controller: "out" }, // for employees
  { path: "/:id", method: "get", controller: "view" }, // for employees
  { path: "/mark_absent", method: "post", controller: "markAbsentOrOnLeave" }, // for HR or ADMIN
  { path: "/mark_on_leave", method: "post", controller: "markAbsentOrOnLeave" }, // for HR or ADMIN
  // { path: "/:id", method: "put", controller: "update" }, // for employees
  // { path: "/:id", method: "delete", controller: "delete" }, // for employees
]

const pushNotificationRoutes = [
  { path: "/list", method: "get", controller: "list" }, // for HR or ADMIN
  { path: "/subscribe/:id?", method: "post", controller: "subscribe" }, // for everyone
  { path: "/unsubscribe/:id?", method: "put", controller: "unsubscribe" }, // for everyone
  { path: "/push", method: "post", controller: "push" }, // for HR or ADMIN
  { path: "/:id", method: "delete", controller: "delete" }, // for HR or ADMIN
]

module.exports = {
  employeeRoutes,
  adminRoutes,
  departmentRoutes,
  designationRoutes,
  holidayRoutes,
  leaveApplicationRoutes,
  leaveTypeRoutes,
  leaveRoutes,
  attendanceRoutes,
  pushNotificationRoutes,
}
