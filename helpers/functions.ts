import crypto from "crypto";
import aws from "aws-sdk";
import bluebird from "bluebird";
import * as dotenv from 'dotenv';

module.exports.uploadImage = async function uploadImage(base64Image:String) {

  aws.config.setPromisesDependency(bluebird)
  aws.config.update({
    accessKeyId: process.env.awsAccessKeyId,
    secretAccessKey: process.env.awsSecretAccessKey,
    region: process.env.awsDefaultRegion
  })

  const s3 = new aws.S3()

  let base64Data: Buffer

  base64Data = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64')

  const type = base64Image.split(';')[0].split('/')[1]

  const key = process.env.s3Dir + '/' + crypto.randomBytes(20).toString('hex') + '.' + type

  const params = {
    Bucket: process.env.s3Bucket,
    Key: key,
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: 'image/' + type
  }

  try {
    const { Location } = await s3.upload(new Putparams).promise()
    return Location

  } catch (error:any) {
    throw new Error(error)
  }
}
