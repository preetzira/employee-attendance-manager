const PushNotification = require("../models/pushNotification")
const { sendPushNotification } = require("../services/pushNotifications")
const { responseFlags, CustomError } = require("../utils/constants")
const { successResponse } = require("../utils/responseHelpers")

module.exports = function () {
  return {
    list: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
        const pushNotificationSubscribers = await PushNotification.find({})
        .populate([
          {
            path: "createdBy",
            select: "department",
            model: "Employee",
            populate:{ path: "department", model: "Department", select: "title code" },
          },
          {
            path: "createdBy",
            select: "-_id fullname code designation",
            model: "Employee",
            populate:{ path: "designation", model: "Designation", select: "title code" },
          },
          {
            path: "updatedBy",
            select: "department",
            model: "Employee",
            populate:{ path: "department", model: "Department", select: "title code" },
          },
          {
            path: "updatedBy",
            select: "-_id fullname code designation",
            model: "Employee",
            populate:{ path: "designation", model: "Designation", select: "title code" },
          },
        ])
      return successResponse(res, responseFlags.SUCCESS, {
        pushNotificationSubscribers,
      })
    },
    subscribe: async function (req, res) {
      const { subscription, platform = {} } = req.body
      const { id } = req.params
      if (id && id !== ",") {
        await PushNotification.findByIdAndUpdate(id, {
          $set: { isActive: true },
        })
        return successResponse(res, responseFlags.SUCCESS, {
          message: "Notification re-subscribed successfully",
        })
      }

      if (!subscription)
        throw new CustomError("BAD_REQUEST", "Required parameters are missing")
      const createdBy = req.session.user._id,
        createdByOnModel = req.session.onModel
      const updateObject = {
        subscription,
        platform,
        createdBy,
        createdByOnModel,
        updatedBy: createdBy,
        updatedByOnModel: createdByOnModel,
      }
      await PushNotification.findOneAndUpdate(
        {
          "subscription.endpoint": subscription.endpoint,
        },
        {
          $set: updateObject,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      return successResponse(res, responseFlags.CREATED, {
        message: "Notification subscribed successfully",
      })
    },
    unsubscribe: async function (req, res) {
      const { id } = req.params
      const queryObject = {},
        isHrOrAdmin = req.isAdmin() || req.isHR()
      if (!id || !isHrOrAdmin) queryObject.createdBy = req.session.user._id
      else if (id !== "," && isHrOrAdmin) queryObject._id = id
      const unSubscribedRecord = await PushNotification.findOneAndUpdate(
        queryObject,
        {
          $set: {
            isActive: false,
            updatedBy: req.session.user._id,
            updatedByOnModel: req.session.onModel,
          },
        },
      )
      if (!unSubscribedRecord)
        throw new CustomError("NOT_FOUND", "No record found")
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Notification unsubscribed successfully",
      })
    },
    push: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { payload, endpoints = [] } = req.body
      const queryObject = { isActive: true }
      if (endpoints.length)
        Object.assign({}, queryObject, {
          "subscriber.endpoint": { $in: endpoints },
        })
      const subscribers = await PushNotification.find(
        queryObject,
        "subscription createdBy",
      ).populate(
        [
          {
            path: "createdBy",
            select: "department",
            model: "Employee",
            populate:{ path: "department", model: "Department", select: "title code" },
          },
          {
            path: "createdBy",
            select: "-_id fullname code designation",
            model: "Employee",
            populate:{ path: "designation", model: "Designation", select: "title code" },
          },
        ]
      )
      subscribers.forEach(({ subscription }) =>
        sendPushNotification({ subscription, payload }),
      )
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Notification sent successfully",
      })
    },
    delete: async function (req, res) {
      if (!(req.isAdmin() || req.isHR()))
        throw new CustomError("FORBIDDEN", "Operation not allowed")
      const { id } = req.params
      const deletedRecord = await PushNotification.findByIdAndDelete(id)
      if (!deletedRecord) throw new CustomError("NOT_FOUND", "No record found")
      return successResponse(res, responseFlags.SUCCESS, {
        message: "Record deleted successfully",
      })
    },
  }
}
