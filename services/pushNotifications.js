const webpush = require("web-push")
const logger = require("../utils/logger")

const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  vapidPublicKey,
  vapidPrivateKey,
)

async function sendPushNotification({ subscription, payload }) {
  try {
    return webpush.sendNotification(subscription, JSON.stringify(payload))
  } catch (error) {
    logger.error(
      `
        \x1b[31m${error.stack}\x1b[0m
        Subscription: ${JSON.stringify(subscription)}
        Payload: ${JSON.stringify(payload)}
        `,
    )
    throw new Error(error)
  }
}

module.exports = {
  sendPushNotification,
}
