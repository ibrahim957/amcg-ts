import {Request,NextFunction, Response} from "express";
import * as dotenv from 'dotenv';
import customers from "../../models/customerModel";

dotenv.config();

import jwt,{Secret} from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import * as functions from "../../helpers/functions";

const config = process.env

const register = async(req: Request, res: Response, next: NextFunction) => {

  try {

    const { email_address, password } = req.body

    if(!email_address) return next('Email address is required')

    // if(!await func.validateEmail(email_address)) return next('Email Address is not valid')

    if(!password) return next('Password is required')

    // if(!await func.validatePassword(password)) return next('Password is not valid')

    const customer:any = await customers.findOne({ email_address })

    if(!customer) {

      const encrypted = await bcrypt.hash(password, 10);

      const data = {
        email_address,
        password: encrypted,
      }

      await customers.create(data).then((response: object) => {

        const token = jwt.sign(email_address, process.env.TOKEN_SECRET || "123456")

        return res.status(200).send({
          status: 200,
          error: false,
          message: 'Customer registered successfully',
          Customer: response,
          token : token
        })

      }).catch((error :Error) => {
        return next(error)
      })

    } else {
      return next('Customer already exists')
    }

  } catch(err) {
    return next(err)
  }

}

const login = async(req: Request, res: Response, next: NextFunction) => {

  try {

    const { email_address, password } = req.body

    if(!password) return next('Password is required')

    // if(!await func.validatePassword(password)) return next('Password is not valid')

    if(!email_address) return next('Email address is required')

    // if(!await func.validateEmail(email_address)) return next('Email Address is not valid')

    const customer:any = await customers.findOne({ email_address })

    if(customer) {

      if(await bcrypt.compare(password, customer.password)) {

        const token = jwt.sign(email_address, config.TOKEN_SECRET || "123456")

        return res.status(200).send({
          status: 200,
          error: false,
          message: 'Customer logged in successfully',
          Customer: customer,
          token: token
        })

      } else {
        return next("Invalid credentials provided")
      }

    } else {
      return next("No Customer found")
    }

  } catch(err) {
    return next(err)
  }

}

const passwordResetMail = async (req :Request, res:Response, next:NextFunction) => {

  try {

    const {email_address} = req.body

    if(!email_address){
      return next('Email Address is required')
    }

    let customer:any = await customers.findOne({ email_address: email_address })

    if(!customer) {
      return next('Customer not found')
    }

    const query = { email_address: email_address }

    const verification_code = (process.env.NODE_ENV === 'development') ? 1234 : Math.floor(1000 + Math.random() * 9000)

    await functions.sendEmail(email_address,'Password Reset Code',`Your verification code for Password Reset is : ${verification_code}, If password reset was not initiated by you then please discard this mail.`)

    let update = {
      otp : verification_code
    }

    const option = { new: true }

    await customers.findOneAndUpdate(query, update, option).then(() => {

      return res.status(200).send({
        status: 200,
        error: false,
        message: 'Password reset mail sent',
      })

    }).catch((err: any) => {
      return next(err)
    })

  } catch (err) {
    return next(err)
  }
}

const passwordReset = async (req :Request, res:Response, next:NextFunction) => {

  try {

    const {email_address,otp,newPass} = req.body

    if(!email_address){
      return next('Email Address is required')
    }
    if(!otp){
      return next('Otp is required')
    }
    if(!newPass){
      return next('New Password is required')
    }

    let customer:any = await customers.findOne({ email_address: email_address })

    if(!customer) {
      return next('Customer not found')
    }

    const query = { email_address: email_address }

    if(otp !== customer.otp){
      return next('Otp does not match')
    }

    const encrypted = await bcrypt.hash(newPass, 10)

    let update = {
      otp : null,
      password: encrypted
    }

    const option = { new: true }

    await customers.findOneAndUpdate(query, update, option).then(async() => {

      await functions.sendEmail(email_address,'Password Reset',`Your Password has been reset`)

      return res.status(200).send({
        status: 200,
        error: false,
        message: 'Password reset mail sent',
      })

    }).catch((err: any) => {
      return next(err)
    })

  } catch (err) {
    return next(err)
  }

}

module.exports = {
  register,
  login,
  passwordResetMail,
  passwordReset
}
