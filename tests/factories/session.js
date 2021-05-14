const Sessions = require('../../models/sessions')
const { AuthSession } = require('../../utils/session')

module.exports = async function(user,onModel){
  return Sessions.create({
    user,
    onModel,
    deviceOs: "test",
    ipAddress: `127.0.0.1:${process.env.PORT}`,
    location: "test",
    expiresAt: new Date(Date.now() + 300000)
  }).then((session) => {
    const authSession = new AuthSession(session._id, session.expiresAt)
    const token = authSession.encoded()
    return token
  })
}