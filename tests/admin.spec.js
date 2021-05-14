const axios = require('axios');
const mongoose = require('mongoose')
const Admin = require('../models/admin')
const Sessions = require('../models/sessions');
const adminFactory = require('./factories/admin');
const sessionFactory = require('./factories/session')

let admin,token
describe('Admin', () => {
  beforeAll(async done => {
    admin = await adminFactory()
    token = await sessionFactory(admin._id.toString(),"Admin")
    done()
  })

  test('should login', async () => {
    expect(token).not.toBeNull()
    // const config = {
    //   method: 'post',
    //   url: 'http://localhost:8000/v1/admin/login',
    //   data: {
    //     "email": "test@email.com",
    //     "password": "Test@12345",
    //   }
    // };
    // const {data:res} = await axios(config)
    // expect(res.status).toEqual(200)
  })

  test('should list all employees', async () => {
    const config = {
      method: 'get',
      url: 'http://localhost:8000/v1/employee/list',
      headers:{
        Authorization: token
      }
    };
    const {data:res} = await axios(config)
    expect(res.status).toEqual(200)
  })
  

  afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    await Admin.findByIdAndDelete(admin._id)
    await Sessions.findOneAndDelete({user:admin._id})
    mongoose.connection.close()
    done()
  })  
})

