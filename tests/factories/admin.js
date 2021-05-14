const Admin = require('../../models/admin')

module.exports = async function(){
  const config = {
    name:"Test",
    email:"test@email.com",
    password:"Test@12345"
  }
  return Admin.findOneAndUpdate({email:config.email},{$set:{...config}},{ upsert: true, new: true, setDefaultsOnInsert: true },)
}