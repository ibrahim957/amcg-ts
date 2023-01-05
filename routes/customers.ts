import {Router} from "express";

const apiKey = require('../middleware/apiKey')
const authToken = require('../middleware/authToken')
const authController = require('../controllers/customers/authController')

const router = Router()

router.use('/', apiKey, (router: Router) => {

  router.post('/register', authController.register)
  router.post('/login', authController.login)

  router.use('/', authToken, (router: Router) => {

    // router.post('/log-out', authController.logOut)

  })

})

export = router
