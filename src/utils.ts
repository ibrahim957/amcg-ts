import { AxiosResponse } from 'axios';

const axios = require('axios');
const sharp = require('sharp');

function splitString(s: string): string[] {
  var middle = Math.floor(s.length / 2);
  var before = s.lastIndexOf(' ', middle);
  var after = s.indexOf(' ', middle + 1);

  if (before == -1 || (after != -1 && middle - before >= after - middle)) {
    middle = after;
  } else {
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
    const sharpImageMetadata = await sharpImage.metadata();
    console.log("Image metadata: ", sharpImageMetadata);

    // break caption into two halves
    const parts = splitString(caption);

    // Define the SVG image to overlay our on image
    const svgImage = `
      <svg width="${sharpImageMetadata.width}" height="${sharpImageMetadata.height}" style="position: relative">
        <style>
        .title { fill: #001;text-shadow:1px 1px darkred; font-size: 150%; font-weight: bold;}
        </style>
        
        <text  y="10%" text-anchor="left" style="position: absolute;left:10px;right: 10px " class="title">${parts[0]}</text>
        <text  y="80%" text-anchor="left" style="position: absolute;left:10px;right: 10px" class="title">${parts[1]}</text>
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
