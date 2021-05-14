require("../models")
const config = require("config")
const mongoose = require("mongoose")

const { user, password, host, database } = config.get("dev.database")
const uri = `mongodb+srv://${user}:${password}@${host}/${database}?retryWrites=true&w=majority`

mongoose.Promise = global.Promise
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .catch((err) => console.error(`mongoose throws ${err}`))
