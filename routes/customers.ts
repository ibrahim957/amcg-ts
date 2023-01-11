import {Router} from "express";

import apiKey from '../middleware/apiKey'
import authToken from'../middleware/authToken'
const authController = require('../controllers/customers/authController')
const profileController = require('../controllers/customers/profileController')

const customerRouter = Router()

// CustomerRouter.get('/',authController.test)
// CustomerRouter.get('/a', (request, response) => {
//   console.log('11')
//   return response.json("OK");
// });


// CustomerRouter.use('/', apiKey, (router: Router) => {
//
//   router.post('/register', authController.register)
//   router.post('/login', authController.login)
//
//   router.use('/', authToken, (router: Router) => {
//
//     // router.post('/log-out', authController.logOut)
//
//   })
//
// })
customerRouter.use(apiKey)
customerRouter.post('/register',authController.register)
customerRouter.post('/login',authController.login)
customerRouter.use(authToken)
customerRouter.post('/policy',profileController.policy)

export default customerRouter
