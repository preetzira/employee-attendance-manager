const fs = require("fs")
const path = require("path")
const jwt = require("jsonwebtoken")
const Sessions = require("../models/sessions")
const jwtPublicKey = fs.readFileSync(
  path.join(__dirname, "../keys/jwt-public.key"),
  "utf-8",
)
const jwtPrivateKey = fs.readFileSync(
  path.join(__dirname, "../keys/jwt-private.key"),
  "utf-8",
)

class AuthSession {
  constructor(sid, exp) {
    this.sid = sid
    this.exp = exp
    this.jwtOptions = {
      subject: process.env.JWT_SUB,
      issuer: process.env.JWT_ISS,
      audience: process.env.JWT_AUD,
    }
    this.jwtSignOptions = {
      ...this.jwtOptions,
      expiresIn: +((new Date(exp) - new Date()) / 1000).toFixed(0),
      algorithm: "RS256",
    }
    this.jwtVerifyOptions = {
      ...this.jwtOptions,
      algorithms: ["RS256"],
    }
  }
  toJson() {
    return { sid: this.sid }
  }
  encoded() {
    return jwt.sign(
      {
        ...this.toJson(),
      },
      { key: jwtPrivateKey, passphrase: process.env.JWT_KEY_PASS },
      this.jwtSignOptions,
    )
  }
  static async decoded(decodedJwt) {
    return jwt.verify(
      decodedJwt,
      jwtPublicKey,
      this.jwtVerifyOptions,
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
      jwtPublicKey,
      this.jwtVerifyOptions,
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
    expiresAt: new Date(Date.now() + +process.env.TOKEN_EXPIRATION_TIME),
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
