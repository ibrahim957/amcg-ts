import {Router} from "express";

import apiKey from '../middleware/apiKey'
import authToken from'../middleware/authToken'
const authController = require('../controllers/customers/authController')
const profileController = require('../controllers/customers/profileController')
const contentController = require('../controllers/customers/contentController')

const customerRouter = Router()

customerRouter.use(apiKey)
customerRouter.post('/register',authController.register)
customerRouter.post('/login',authController.login)
customerRouter.post('/reset-pass-auth',authController.passwordResetMail)
customerRouter.post('/reset-pass',authController.passwordReset)
customerRouter.get('/payment',contentController.payment)
customerRouter.get('/subscription',contentController.subscriptionPayment)
customerRouter.use(authToken)
customerRouter.post('/policy',profileController.policy)
customerRouter.post('/verify-mail-code',profileController.verifyMailCode)
customerRouter.post('/verify-mail',profileController.verifyMail)
customerRouter.post('/research',contentController.research)
customerRouter.post('/subscription',contentController.subscribe)

export default customerRouter
