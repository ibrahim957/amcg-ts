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
function splitString(s) {
    var middle = Math.floor(s.length / 2);
    var before = s.lastIndexOf(' ', middle);
    var after = s.indexOf(' ', middle + 1);
    if (before == -1 || (after != -1 && middle - before >= after - middle)) {
        middle = after;
    }
    else {
        middle = before;
    }
    var s1 = s.substring(0, middle);
    var s2 = s.substring(middle + 1);
    return [s1, s2];
}
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
            const sharpImageMetadata = yield sharpImage.metadata();
            console.log("Image metadata: ", sharpImageMetadata);
            // break caption into two halves
            const parts = splitString(caption);
            // Define the SVG image to overlay our on image
            const svgImage = `
      <svg width="${sharpImageMetadata.width}" height="${sharpImageMetadata.height}">
        <style>
        .title { fill: #001;text-shadow:3px 3px red; font-size: 120%; font-weight: bold;}
        </style>
        
        <text x="2%" y="5%" text-anchor="right" class="title">${parts[0]}</text>
        <text x="2%" y="95%" text-anchor="right" class="title">${parts[1]}</text>
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
