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
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
// get all imports
const deepai_1 = __importDefault(require("deepai"));
const openai = __importStar(require("openai"));
// Config constants
let openaiApi;
let openAiConfig;
const utils_1 = require("./utils");
const sharp = require("sharp");
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
/**
 * Image URL for testing image processing flows, as not to run up API usage cost
 */
const TEST_IMAGE_URL = 'https://api.deepai.org/job-view-file/6a9cfedc-d418-44e7-97e1-e265ead8b913/outputs/output.jpg';
/**
 *
 * @param prompt The test prompt DeepAI will generate image from
 * @returns DeepAI's ModelOutputs type with id and output_url string attributes
 */
function generateImages(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        // DeepAI config
        deepai_1.default.setApiKey(process.env.DEEPAI_API_KEY);
        const images = yield deepai_1.default.callStandardApi('text2img', {
            text: prompt,
        });
        return images;
    });
}
function generateMemes(prompt) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // OpenAI config
        openAiConfig = new openai.Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        openaiApi = new openai.OpenAIApi(openAiConfig);
        // DeepAI config
        deepai_1.default.setApiKey((_a = process.env.DEEPAI_API_KEY) !== null && _a !== void 0 ? _a : '');
        // arrays to use
        const imagesList = [];
        // const imagesBuffers: Buffer[] = [];
        // const imagesCaptionedBuffers: Buffer[] = [];
        // In dev mode we don't generate a new DeepAI image, we reuse one.
        if (process.env.NODE_ENV === 'development') {
            imagesList.push(yield (0, utils_1.downloadFile)(TEST_IMAGE_URL));
        }
        const imagesBuffers = imagesList.map(deepAiResp => {
            return Buffer.from(deepAiResp.data, 'binary');
        });
        const imagesCaptionedBuffers = yield Promise.all(imagesBuffers.map((imgbuff) => __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.addTextOnImage)(imgbuff, prompt);
        })));
        // In dev mode we store all images to local storage
        if (process.env.NODE_ENV === 'development') {
            const counter = 0;
            Promise.all(imagesCaptionedBuffers.map((imgbuff) => __awaiter(this, void 0, void 0, function* () {
                yield sharp(imgbuff).toFormat('jpeg').toFile(`${counter}.jpeg`);
            })));
        }
    });
}
app.get('/', (req, res) => {
    res.send(generateMemes('Imran khan is happy'));
});
app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});
