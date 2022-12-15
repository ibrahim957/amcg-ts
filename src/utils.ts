import {AxiosResponse} from 'axios';

const axios = require('axios');
const sharp = require('sharp');

/**
 * @async
 * @param url The URL of the jpg file to doanload as a steam
 * @returns AxiosResponse<any, any>
 */
export async function downloadFile(url: string): Promise<AxiosResponse> {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
    });
    return response;
  } catch (err) {
    throw Error(`downloadFile(): ${err}`);
  }
}

/**
 * @async
 * @param image Image as a buffer
 * @param caption The caption to stitch onto an image
 */
export async function addTextOnImage(
  image: Buffer,
  caption: string
): Promise<Buffer> {
  try {
    const sharpImage = await sharp(image);
    const sharpImageMetadata = sharpImage.metadata();

    // Define the SVG image to overlay our on image
    const svgImage = `
      <svg width="${sharpImageMetadata.width}" height="${sharpImageMetadata.height}">
        <style>
        .title { fill: #001; font-size: 70px; font-weight: bold;}
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
  } catch (err) {
    throw Error(`addTextOnImage(): ${err}`);
  }
}
