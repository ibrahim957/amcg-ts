import nodemailer from 'nodemailer'
import hbs, {NodemailerExpressHandlebarsOptions} from 'nodemailer-express-handlebars'
import smtpTransport from 'nodemailer-smtp-transport'

import path from "path";

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

export async function validateEmail (emailAddress:string)
{
	let regexEmail = /^\w+(-?\w+)*@\w+(-?\w+)*(\.\w{2,3})+$/
	return emailAddress.match(regexEmail)
}

export async function validatePassword (password:string)
{
	let regexPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})')
	return regexPassword.test(password)
}