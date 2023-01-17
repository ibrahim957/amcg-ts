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
const functions = __importStar(require("../../helpers/functions"));
dotenv.config();
const policy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email_address = req.user;
        let customer = yield customerModel_1.default.findOne({ email_address: email_address });
        if (!customer) {
            return next('Rider not found');
        }
        const query = { email_address: email_address };
        const update = {
            'status.policies_accepted': true
        };
        const option = { new: true };
        yield customerModel_1.default.findOneAndUpdate(query, update, option).then(() => {
            return res.status(200).send({
                status: 200,
                error: false,
                message: 'User policies accepted',
            });
        }).catch((err) => {
            return next(err);
        });
    }
    catch (err) {
        return next(err);
    }
});
const profile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email_address = req.user;
        let customer = yield customerModel_1.default.findOne({ email_address: email_address });
        if (!customer) {
            return next('Customer not found');
        }
        const { name, base64_image } = req.body;
        if (!name) {
            return next('Name is required');
        }
        const query = { email_address: email_address };
        let update = {
            name,
            photo: null
        };
        // if(base64_image) {
        //   update.photo = await functions.uploadImage(base64_image)
        // }
        const option = { new: true };
        yield customerModel_1.default.findOneAndUpdate(query, update, option).then(() => {
            return res.status(200).send({
                status: 200,
                error: false,
                message: 'User policies accepted',
            });
        }).catch((err) => {
            return next(err);
        });
    }
    catch (err) {
        return next(err);
    }
});
const verifyMailCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email_address = req.user;
        let customer = yield customerModel_1.default.findOne({ email_address: email_address });
        if (!customer) {
            return next('Customer not found');
        }
        const query = { email_address: email_address };
        const verification_code = (process.env.NODE_ENV === 'development') ? 1234 : Math.floor(1000 + Math.random() * 9000);
        yield functions.sendEmail(email_address, 'Verify Email', `Your verification code for Email Verification is : ${verification_code}, If this is not you then please discard this mail.`);
        let update = {
            otp: verification_code
        };
        const option = { new: true };
        yield customerModel_1.default.findOneAndUpdate(query, update, option).then(() => {
            return res.status(200).send({
                status: 200,
                error: false,
                message: 'Email verification code sent',
            });
        }).catch((err) => {
            return next(err);
        });
    }
    catch (err) {
        return next(err);
    }
});
const verifyMail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email_address = req.user;
        let customer = yield customerModel_1.default.findOne({ email_address: email_address });
        if (!customer) {
            return next('Customer not found');
        }
        const { otp } = req.body;
        if (!otp) {
            return next('Otp is required');
        }
        if (otp !== customer.otp) {
            return next('Otp does not match');
        }
        const query = { email_address: email_address };
        let update = {
            otp: null,
            'status.email_verified': true
        };
        const option = { new: true };
        yield customerModel_1.default.findOneAndUpdate(query, update, option).then(() => __awaiter(void 0, void 0, void 0, function* () {
            return res.status(200).send({
                status: 200,
                error: false,
                message: 'Email Verified',
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
    policy,
    profile,
    verifyMailCode,
    verifyMail
};
