"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiKey_1 = __importDefault(require("../middleware/apiKey"));
const authToken_1 = __importDefault(require("../middleware/authToken"));
const authController = require('../controllers/customers/authController');
const profileController = require('../controllers/customers/profileController');
const customerRouter = (0, express_1.Router)();
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
customerRouter.use(apiKey_1.default);
customerRouter.post('/register', authController.register);
customerRouter.post('/login', authController.login);
customerRouter.post('/reset-pass-auth', authController.passwordResetMail);
customerRouter.use(authToken_1.default);
customerRouter.post('/policy', profileController.policy);
exports.default = customerRouter;
