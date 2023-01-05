import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';

// get all imports
import deepai from 'deepai';
import * as openai from 'openai';

// Config constants
let openaiApi: openai.OpenAIApi;
let openAiConfig: openai.Configuration;

import { addTextOnImage, downloadFile } from './utils';
import { AxiosResponse } from 'axios';
import sharp = require('sharp');

dotenv.config();

const app: Express = express();
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
async function generateImages(prompt: string): Promise<any> {
  // DeepAI config
  deepai.setApiKey(process.env.DEEPAI_API_KEY as string);
  const images = await deepai.callStandardApi('text2img', {
    text: prompt,
  });
  return images;
}

async function generateMemes(prompt: string) {
  // OpenAI config
  openAiConfig = new openai.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  openaiApi = new openai.OpenAIApi(openAiConfig);

  // DeepAI config
  deepai.setApiKey(process.env.DEEPAI_API_KEY ?? '');

  // arrays to use
  const imagesList: AxiosResponse[] = [];
  // const imagesBuffers: Buffer[] = [];
  // const imagesCaptionedBuffers: Buffer[] = [];

  // In dev mode we don't generate a new DeepAI image, we reuse one.
  if (process.env.NODE_ENV === 'development') {
    imagesList.push(await downloadFile(TEST_IMAGE_URL));
  }

  const imagesBuffers: Buffer[] = imagesList.map(deepAiResp => {
    return Buffer.from(deepAiResp.data, 'binary');
  });
  const imagesCaptionedBuffers: Buffer[] = await Promise.all(
    imagesBuffers.map(async imgbuff => {
      return await addTextOnImage(imgbuff, prompt);
    })
  );

  // In dev mode we store all images to local storage
  if (process.env.NODE_ENV === 'development') {
    const counter = 0;
    Promise.all(
      imagesCaptionedBuffers.map(async imgbuff => {
        await sharp(imgbuff).toFormat('jpeg').toFile(`${counter}.jpeg`);
      })
    );
  }
}

app.get('/', (req: Request, res: Response) => {
  res.send(generateMemes('Imran khan is happy'))
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
