import crypto from "crypto";
import aws from "aws-sdk";
import bluebird from "bluebird";
import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer'
import hbs, {NodemailerExpressHandlebarsOptions} from 'nodemailer-express-handlebars'
import smtpTransport from 'nodemailer-smtp-transport'

import path from "path";

// exports.uploadImage = async function uploadImage(base64Image:String) {
//
//   aws.config.setPromisesDependency(bluebird)
//   aws.config.update({
//     accessKeyId: process.env.awsAccessKeyId,
//     secretAccessKey: process.env.awsSecretAccessKey,
//     region: process.env.awsDefaultRegion
//   })
//
//   const s3 = new aws.S3()
//
//   let base64Data: Buffer
//
//   base64Data = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
//
//   const type = base64Image.split(';')[0].split('/')[1]
//
//   const key = process.env.s3Dir + '/' + crypto.randomBytes(20).toString('hex') + '.' + type
//
//   const params = {
//     Bucket: process.env.s3Bucket,
//     Key: key,
//     Body: base64Data,
//     ACL: 'public-read',
//     ContentEncoding: 'base64',
//     ContentType: 'image/' + type
//   }
//
//   try {
//     const { Location } = await s3.upload(new Putparams).promise()
//     return Location
//
//   } catch (error:any) {
//     throw new Error(error)
//   }
// }

export async function sendEmail(to:String, subject:String, emailBody:String) {

  let transporter

  if(process.env.NODE_ENV === 'production'){
    transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS
      }
    }))
  }
  else {
    transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  }

  const handlebarOptions:NodemailerExpressHandlebarsOptions = {
    viewEngine: {
      partialsDir: path.resolve('./views/'),
      defaultLayout: false
    },
    viewPath: path.resolve('./views/')
  }

  transporter.use('compile', hbs(handlebarOptions))

  let mailOptions:any = {
    from: 'info@amcg.com',
    to: to,
    subject: subject,
    template: 'email',
    context: {
      emailBody: emailBody
    }
  }

  await transporter.sendMail(mailOptions, function (error:any, response) {

    if (error) {
      throw new Error(error)
    } else {
      return response
    }
  })

}
