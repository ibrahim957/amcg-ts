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
const stripe_1 = __importDefault(require("stripe"));
// @ts-ignore
const stripe = new stripe_1.default('sk_test_51LysudBXNTMYmqBgC40ZaPMeY7zK0fvza3uB82eiiam26Z59tB7dv71R4uII9xhyDnJQPz4q3bATtAmbhN8mBq3T00olxlXc3w');
const payment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const YOUR_DOMAIN = 'http://localhost:3000';
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: [
                'card'
            ],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'AMCG Research'
                        },
                        unit_amount: 100
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}?success=true`,
            cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        });
        res.send(session.url);
    }
    catch (err) {
        return next(err);
    }
});
const research = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email_address = req.user;
        let customer = yield customerModel_1.default.findOne({ email_address: email_address });
        if (!customer) {
            return next('Customer not found');
        }
        const { keywords } = req.body;
        if (!keywords) {
            return next("Keywords are required");
        }
        return res.status(200).send({
            status: 200,
            error: false,
            message: 'Research successful'
        });
    }
    catch (err) {
        return next(err);
    }
});
const subscriptionPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const YOUR_DOMAIN = 'http://localhost:3000';
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: [
                'card'
            ],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'AMCG Subscription'
                        },
                        unit_amount: 200
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}?success=true`,
            cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        });
        res.send(session.url);
    }
    catch (err) {
        return next(err);
    }
});
const subscribe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email_address = req.user;
        let customer = yield customerModel_1.default.findOne({ email_address: email_address });
        if (!customer) {
            return next('Customer not found');
        }
        customer.status.subscribed = true;
        yield customer.save().then(() => {
            return res.status(200).send({
                status: 200,
                error: false,
                message: 'User Subscribed',
            });
        }).catch((err) => {
            return next(err);
        });
    }
    catch (err) {
        return next(err);
    }
});
module.exports = {
    payment,
    research,
    subscriptionPayment,
    subscribe
};
