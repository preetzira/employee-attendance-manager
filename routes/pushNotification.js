const router = require("express").Router()
const PushNotificationController = require("../controllers/pushNotification")()
const asyncHandlerMiddleware = require("../utils/asyncHandlerMiddleware")
const { pushNotificationRoutes } = require("./CONSTANTS")

/**
 * @swagger
 * /push_notification/list:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     description: List all push notification subscriptions.
 *     tags:
 *      - PushNotification
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PushNotificationResponseObject'
 *
 * /push_notification/subscribe/{id}:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: Subscribe push notification.
 *     tags:
 *      - PushNotification
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: false
 *        description: PushNotification's `_id` of in-active, but subscribed record. To re-subscribe notifications.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PushNotificationSubscribeRequestObject'
 *     responses:
 *       201:
 *         description: Notification subscribed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSuccessResponseObject'
 *
 * /push_notification/unsubscribe/{id}:
 *   put:
 *     security:
 *      - BearerAuth: []
 *     description: Unsubscribe push notification.
 *     tags:
 *      - PushNotification
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: false
 *        description: PushNotification's `_id` of subscribed record (Admin or HR only).
 *     responses:
 *       200:
 *         description: Notification unsubscribed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateSuccessResponseObject'
 *
 * /push_notification/push:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     description: Push a notification to the active subscribers.
 *     tags:
 *      - PushNotification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref:
 *               "#/components/schemas/PushNotificationPayloadObject"
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *
 * /push_notification/{id}:
 *   delete:
 *     security:
 *      - BearerAuth: []
 *     description: Deletes a subscription.
 *     tags:
 *      - PushNotification
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: PushNotification's `_id` of the record to be deleted. HR/Admin only.
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteSuccessResponseObject'
 *
 */
pushNotificationRoutes.forEach((route) => {
  router[route.method](
    route.path,
    asyncHandlerMiddleware(PushNotificationController[route.controller]),
  )
})

module.exports = router
