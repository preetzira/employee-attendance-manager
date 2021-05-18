const webpush = require("web-push")

const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  vapidPublicKey,
  vapidPrivateKey,
)

async function sendPushNotification({ subscription, payload }) {
  return webpush.sendNotification(subscription, JSON.stringify(payload))
}

module.exports = {
  sendPushNotification,
}
