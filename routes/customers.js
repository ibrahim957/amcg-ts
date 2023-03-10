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
const contentController = require('../controllers/customers/contentController');
const customerRouter = (0, express_1.Router)();
customerRouter.use(apiKey_1.default);
customerRouter.post('/register', authController.register);
customerRouter.post('/login', authController.login);
customerRouter.post('/reset-pass-auth', authController.passwordResetMail);
customerRouter.post('/reset-pass', authController.passwordReset);
customerRouter.use(authToken_1.default);
customerRouter.post('/policy', profileController.policy);
customerRouter.post('/verify-mail-code', profileController.verifyMailCode);
customerRouter.post('/verify-mail', profileController.verifyMail);
customerRouter.get('/subscription-payment', contentController.subscriptionPayment);
customerRouter.post('/subscribe', contentController.subscribe);
customerRouter.post('/research', contentController.research);
customerRouter.get('/history', contentController.history);
exports.default = customerRouter;
