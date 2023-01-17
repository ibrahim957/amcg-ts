import {NextFunction, Response} from "express";
import * as dotenv from 'dotenv';
import customers from "../../models/customerModel";
import * as functions from "../../helpers/functions";

dotenv.config();

import bcrypt from 'bcryptjs'
import {CustomRequest} from "../../middleware/authToken";

const policy = async (req :CustomRequest, res:Response, next:NextFunction) => {

  try {

    const email_address = req.user

    let customer:any = await customers.findOne({ email_address: email_address })

    if(!customer) {
      return next('Rider not found')
    }

    const query = { email_address: email_address }

    const update = {
      'status.policies_accepted': true
    }

    const option = { new: true }

    await customers.findOneAndUpdate(query, update, option).then(() => {

      return res.status(200).send({
        status: 200,
        error: false,
        message: 'User policies accepted',
      })

    }).catch((err: any) => {
      return next(err)
    })

  } catch (err) {
    return next(err)
  }
}

const profile = async (req :CustomRequest, res:Response, next:NextFunction) => {

  try {

    const email_address = req.user

    let customer:any = await customers.findOne({ email_address: email_address })

    if(!customer) {
      return next('Customer not found')
    }

    const {name, base64_image} = req.body

    if(!name) {
      return next('Name is required')
    }

    const query = { email_address: email_address }

    let update = {
      name,
      photo:null
    }

    // if(base64_image) {
    //   update.photo = await functions.uploadImage(base64_image)
    // }

    const option = { new: true }

    await customers.findOneAndUpdate(query, update, option).then(() => {

      return res.status(200).send({
        status: 200,
        error: false,
        message: 'User policies accepted',
      })

    }).catch((err: any) => {
      return next(err)
    })

  } catch (err) {
    return next(err)
  }
}

const verifyMailCode = async (req :CustomRequest, res:Response, next:NextFunction) => {

  try {

    const email_address:any = req.user

    let customer:any = await customers.findOne({ email_address: email_address })

    if(!customer) {
      return next('Customer not found')
    }

    const query = { email_address: email_address }

    const verification_code = (process.env.NODE_ENV === 'development') ? 1234 : Math.floor(1000 + Math.random() * 9000)

    await functions.sendEmail(email_address,'Verify Email',`Your verification code for Email Verification is : ${verification_code}, If this is not you then please discard this mail.`)

    let update = {
      otp : verification_code
    }

    const option = { new: true }

    await customers.findOneAndUpdate(query, update, option).then(() => {

      return res.status(200).send({
        status: 200,
        error: false,
        message: 'Email verification code sent',
      })

    }).catch((err: any) => {
      return next(err)
    })

  } catch (err) {
    return next(err)
  }
}

const verifyMail = async (req :CustomRequest, res:Response, next:NextFunction) => {

  try {

    const email_address:any = req.user

    let customer:any = await customers.findOne({ email_address: email_address })

    if(!customer) {
      return next('Customer not found')
    }

    const {otp} = req.body

    if(!otp){
      return next('Otp is required')
    }

    if(otp !== customer.otp){
      return next('Otp does not match')
    }

    const query = { email_address: email_address }

    let update = {
      otp : null,
      'status.email_verified': true
    }

    const option = { new: true }

    await customers.findOneAndUpdate(query, update, option).then(async() => {

      return res.status(200).send({
        status: 200,
        error: false,
        message: 'Email Verified',
      })

    }).catch((err: any) => {
      return next(err)
    })

  } catch (err) {
    return next(err)
  }

}

module.exports = {
  policy,
  profile,
  verifyMailCode,
  verifyMail
}
