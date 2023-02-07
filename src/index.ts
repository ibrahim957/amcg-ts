import * as dotenv from 'dotenv';
dotenv.config();

// get all imports
import * as openai from 'openai';

// Config constants
let openaiApi: openai.OpenAIApi;
let openAiConfig: openai.Configuration;

import { addTextOnImage, downloadFile } from './utils';
import { AxiosResponse } from 'axios';
import sharp = require('sharp');

export async function generateMemes(prompt: string) {

  const size = "512x512";
  // Env Config
  openAiConfig = new openai.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  openaiApi = new openai.OpenAIApi(openAiConfig);

  // arrays to use
  const imagesList: AxiosResponse[] = [];

  // Generate Images
  const response = await openaiApi.createImage({
    prompt,
    n: 2,
    size,
  });

  // TODO remove later
  console.log("openaiApi.createImage response: ", response.data.data);

  // download all images generated
  for (const imgObj of response.data.data) {
    imagesList.push(await downloadFile(imgObj.url ?? ""));

  }

  // images to buffer for easier manipulation
  const imagesBuffers: Buffer[] = imagesList.map(img => {
    return Buffer.from(img.data, 'binary');
  });

  // caption images
  const imagesCaptionedBuffers: Buffer[] = await Promise.all(
    imagesBuffers.map(async imgbuff => {
      return await addTextOnImage(imgbuff, prompt);
    })
  );

  // // store all images to local storage
  // let counter = 0;
  // await Promise.all(
  //   imagesCaptionedBuffers.map(async imgbuff => {
  //     await sharp(imgbuff).toFormat('jpeg').toFile(`${counter}.jpeg`);
  //   })
  // );
  return imagesCaptionedBuffers
}

// generateMemes('imran khan is happy').then((response) => {
//   console.log(response)
//   console.log('Exited.');
// });
