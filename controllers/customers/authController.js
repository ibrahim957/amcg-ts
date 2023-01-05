"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const func = require('../../../helpers/functions')
const config = process.env;
const Customers = require('../../models/customerModel');
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email_address, password } = req.body;
        if (!email_address)
            return next('Email address is required');
        // if(!await func.validateEmail(email_address)) return next('Email Address is not valid')
        if (!password)
            return next('Password is required');
        // if(!await func.validatePassword(password)) return next('Password is not valid')
        const Customer = yield Customers.findOne({ email_address });
        if (!Customer) {
            const encrypted = yield bcrypt.hash(password, 10);
            const data = {
                email_address,
                password: encrypted,
            };
            yield Customers.create(data).then((response) => {
                const token = jwt.sign(email_address, config.tokenSecret);
                return res.status(200).send({
                    status: 200,
                    error: false,
                    message: 'Customer registered successfully',
                    Customer: response,
                    token: token
                });
            }).catch((error) => {
                return next(error);
            });
        }
        else {
            return next('Customer already exists');
        }
    }
    catch (err) {
        return next(err);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email_address, password } = req.body;
        if (!password)
            return next('Password is required');
        // if(!await func.validatePassword(password)) return next('Password is not valid')
        if (!email_address)
            return next('Email address is required');
        // if(!await func.validateEmail(email_address)) return next('Email Address is not valid')
        const Customer = yield Customers.findOne({ email_address });
        if (Customer) {
            if (yield bcrypt.compare(password, Customer.password)) {
                const token = jwt.sign(email_address, config.tokenSecret);
                return res.status(200).send({
                    status: 200,
                    error: false,
                    message: 'Customer logged in successfully',
                    Customer: Customer,
                    token: token
                });
            }
            else {
                return next("Invalid credentials provided");
            }
        }
        else {
            return next("No Customer found");
        }
    }
    catch (err) {
        return next(err);
    }
});
module.exports = {
    register,
    login,
};
