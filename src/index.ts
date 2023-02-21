import * as dotenv from 'dotenv';
dotenv.config();

// get all imports
import * as openai from 'openai';

// Config constants
let openaiApi: openai.OpenAIApi;
let openAiConfig: openai.Configuration;

import { addTextOnImage, downloadFile } from './utils';
import { AxiosResponse } from 'axios';

export async function generateMemes(prompt: string) {

  const generations = 2;
  const size = "512x512";
  // Env Config
  openAiConfig = new openai.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  openaiApi = new openai.OpenAIApi(openAiConfig);

  // arrays to use
  const imagesList: AxiosResponse[] = [];

  const caption = await openaiApi.createCompletion({
    model: "text-davinci-003",
    prompt: "a satirical comment on the topic: " + prompt,
    max_tokens: 40,
    temperature: 0,
    n: generations
  });

  console.log(caption.data.choices);
  const temp_prompt: string  = "realistic image of" + prompt;
  // Generate Images
  const response = await openaiApi.createImage({
    prompt: temp_prompt,
    n: generations,
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

  let a = 0;
  // caption images
  const imagesCaptionedBuffers: Buffer[] = await Promise.all(
    imagesBuffers.map(async imgbuff => {
      return await addTextOnImage(imgbuff, caption.data.choices[a++].text ?? prompt);
    })
  );

  return imagesCaptionedBuffers
}
