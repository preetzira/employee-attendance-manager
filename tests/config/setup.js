require("../../models")
const mongoose = require("mongoose")
const config = require("config")
require('dotenv').config()
const { user, password, host, database } = config.get("test.database")
const uri = `mongodb+srv://${user}:${password}@${host}/${database}?retryWrites=true&w=majority`
mongoose.Promise = global.Promise

;(async () => {
  await mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .catch((err) => console.error(`mongoose throws ${err}`))
})()