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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const customerModel_1 = __importDefault(require("../../models/customerModel"));
dotenv.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const functions = __importStar(require("../../helpers/functions"));
const config = process.env;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email_address, password, name } = req.body;
        if (!email_address)
            return next('Email address is required');
        if (!(yield functions.validateEmail(email_address)))
            return next('Email Address is not valid');
        if (!password)
            return next('Password is required');
        if (!(yield functions.validatePassword(password)))
            return next('Password is not valid');
        if (!name)
            return next('UserName is required');
        const customer = yield customerModel_1.default.findOne({ email_address: email_address });
        if (!customer) {
            const encrypted = yield bcryptjs_1.default.hash(password, 10);
            const data = {
                email_address,
                password: encrypted,
                name: name
            };
            yield customerModel_1.default.create(data).then((response) => {
                const token = jsonwebtoken_1.default.sign(email_address, process.env.TOKEN_SECRET || "123456");
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
        if (!(yield functions.validatePassword(password)))
            return next('Password is not valid');
        if (!email_address)
            return next('Email address is required');
        if (!(yield functions.validateEmail(email_address)))
            return next('Email Address is not valid');
        const customer = yield customerModel_1.default.findOne({ email_address: email_address });
        if (customer) {
            if (yield bcryptjs_1.default.compare(password, customer.password)) {
                const token = jsonwebtoken_1.default.sign(email_address, config.TOKEN_SECRET || "123456");
                return res.status(200).send({
                    status: 200,
                    error: false,
                    message: 'Customer logged in successfully',
                    Customer: customer,
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
const passwordResetMail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email_address } = req.body;
        if (!email_address) {
            return next('Email Address is required');
        }
        let customer = yield customerModel_1.default.findOne({ email_address: email_address });
        if (!customer) {
            return next('Customer not found');
        }
        const query = { email_address: email_address };
        const verification_code = (process.env.NODE_ENV === 'development') ? 1234 : Math.floor(1000 + Math.random() * 9000);
        yield functions.sendEmail(email_address, 'Password Reset Code', `Your verification code for Password Reset is : ${verification_code}, If password reset was not initiated by you then please discard this mail.`);
        let update = {
            otp: verification_code
        };
        const option = { new: true };
        yield customerModel_1.default.findOneAndUpdate(query, update, option).then(() => {
            return res.status(200).send({
                status: 200,
                error: false,
                message: 'Password reset mail sent',
            });
        }).catch((err) => {
            return next(err);
        });
    }
    catch (err) {
        return next(err);
    }
});
const passwordReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email_address, otp, newPass } = req.body;
        if (!email_address) {
            return next('Email Address is required');
        }
        if (!otp) {
            return next('Otp is required');
        }
        if (!newPass) {
            return next('New Password is required');
        }
        let customer = yield customerModel_1.default.findOne({ email_address: email_address });
        if (!customer) {
            return next('Customer not found');
        }
        const query = { email_address: email_address };
        if (otp !== customer.otp) {
            return next('Otp does not match');
        }
        const encrypted = yield bcryptjs_1.default.hash(newPass, 10);
        let update = {
            otp: null,
            password: encrypted
        };
        const option = { new: true };
        yield customerModel_1.default.findOneAndUpdate(query, update, option).then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield functions.sendEmail(email_address, 'Password Reset', `Your Password has been reset`);
            return res.status(200).send({
                status: 200,
                error: false,
                message: 'Password reset mail sent',
            });
        })).catch((err) => {
            return next(err);
        });
    }
    catch (err) {
        return next(err);
    }
});
module.exports = {
    register,
    login,
    passwordResetMail,
    passwordReset
};
