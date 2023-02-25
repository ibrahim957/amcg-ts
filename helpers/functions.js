"use strict";
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
exports.validatePassword = exports.validateEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const nodemailer_smtp_transport_1 = __importDefault(require("nodemailer-smtp-transport"));
const path_1 = __importDefault(require("path"));
function sendEmail(to, subject, emailBody) {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter;
        if (process.env.NODE_ENV === 'production') {
            transporter = nodemailer_1.default.createTransport((0, nodemailer_smtp_transport_1.default)({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.EMAIL_PASS
                }
            }));
        }
        else {
            transporter = nodemailer_1.default.createTransport({
                host: process.env.NODEMAILER_HOST,
                port: 2525,
                auth: {
                    user: process.env.NODEMAILER_USER,
                    pass: process.env.NODEMAILER_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
        }
        const handlebarOptions = {
            viewEngine: {
                partialsDir: path_1.default.resolve('./views/'),
                defaultLayout: false
            },
            viewPath: path_1.default.resolve('./views/')
        };
        transporter.use('compile', (0, nodemailer_express_handlebars_1.default)(handlebarOptions));
        let mailOptions = {
            from: 'info@amcg.com',
            to: to,
            subject: subject,
            template: 'email',
            context: {
                emailBody: emailBody
            }
        };
        yield transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                throw new Error(error);
            }
            else {
                return response;
            }
        });
    });
}
exports.sendEmail = sendEmail;
function validateEmail(emailAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let regexEmail = /^\w+(-?\w+)*@\w+(-?\w+)*(\.\w{2,3})+$/;
        return emailAddress.match(regexEmail);
    });
}
exports.validateEmail = validateEmail;
function validatePassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        let regexPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})');
        return regexPassword.test(password);
    });
}
exports.validatePassword = validatePassword;
