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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTextOnImage = exports.downloadFile = void 0;
const axios = require('axios');
const sharp = require('sharp');
/**
 * @async
 * @param url The URL of the jpg file to doanload as a steam
 * @returns AxiosResponse<any, any>
 */
function downloadFile(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
            });
            return response;
        }
        catch (err) {
            throw Error(`downloadFile(): ${err}`);
        }
    });
}
exports.downloadFile = downloadFile;
/**
 * @async
 * @param image Image as a buffer
 * @param caption The caption to stitch onto an image
 */
function addTextOnImage(image, caption) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sharpImage = yield sharp(image);
            const sharpImageMetadata = sharpImage.metadata();
            // Define the SVG image to overlay our on image
            const svgImage = `
      <svg width="${sharpImageMetadata.width}" height="${sharpImageMetadata.height}">
        <style>
        .title { fill: #001; font-size: 30px; font-weight: bold;}
        </style>
        <text x="50%" y="50%" text-anchor="middle" class="title">${caption}</text>
      </svg>
      `;
            const svgBuffer = Buffer.from(svgImage);
            // caption image with text
            sharpImage.composite([
                {
                    input: svgBuffer,
                    top: 0,
                    left: 0,
                },
            ]);
            return sharpImage.toBuffer();
        }
        catch (err) {
            throw Error(`addTextOnImage(): ${err}`);
        }
    });
}
exports.addTextOnImage = addTextOnImage;
