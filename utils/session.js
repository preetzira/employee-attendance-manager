const jwt = require("jsonwebtoken")
const Sessions = require("../models/sessions")

class AuthSession {
  constructor(sid, exp) {
    this.sid = sid
    this.exp = exp
  }
  toJson() {
    return { sid: this.sid, exp: +(new Date(this.exp) / 1000).toFixed(0) }
  }
  encoded() {
    return jwt.sign(
      {
        ...this.toJson(),
      },
      process.env.SECRET_KEY,
    )
  }
  static async decoded(decodedJwt) {
    return jwt.verify(
      decodedJwt,
      process.env.SECRET_KEY,
      async (error, res) => {
        if (error) throw new Error(error.message)
        return await Sessions.findOne(
          { _id: res.sid },
          "user onModel",
        ).populate({
          path: "user",
          select: "fullname code email designation",
          populate: { path: "designation", select: "title code" },
        })
      },
    )
  }

  static async destroy(decodedJwt) {
    return jwt.verify(
      decodedJwt,
      process.env.SECRET_KEY,
      async (error, res) => {
        if (error) throw new Error(error.message)
        return await Sessions.findByIdAndRemove(res.sid)
      },
    )
  }
}

const createSession = ({ req, res, user, onModel }) => {
  return Sessions.create({
    user,
    onModel,
    deviceOs: req.header("deviceOs"),
    ipAddress: req.ip,
    location: req.header("location"),
  }).then((session) => {
    const authSession = new AuthSession(session._id, session.expiresAt)
    const token = authSession.encoded()
    res.cookie("token", token, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expiresAt),
    })
    return { token, expiresIn: new Date(session.expiresAt) - new Date() }
  })
}

const expireSession = ({ res }) => {
  return res.cookie("token", "", {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(),
  })
}

module.exports = {
  AuthSession,
  createSession,
  expireSession,
}
