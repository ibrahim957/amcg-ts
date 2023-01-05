"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_group_router_1 = __importDefault(require("express-group-router"));
const apiKey = require('../middleware/apiKey');
const authToken = require('../middleware/authToken');
const authController = require('../controllers/customers/authController');
const router = new express_group_router_1.default();
router.group('/', apiKey, (router) => {
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.group('/', authToken, (router) => {
        // router.post('/log-out', authController.logOut)
    });
});
module.exports = router.init();
