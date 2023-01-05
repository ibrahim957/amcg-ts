import {NextFunction, Response} from "express";
import {CustomRequest} from "../../middleware/authToken";
import * as dotenv from 'dotenv';
dotenv.config();

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// const func = require('../../../helpers/functions')
const config = process.env
const Customers = require('../../models/customerModel')

const register = async(req: CustomRequest, res: Response, next: NextFunction) => {

  try {

    const { email_address, password } = req.body

    if(!email_address) return next('Email address is required')

    // if(!await func.validateEmail(email_address)) return next('Email Address is not valid')

    if(!password) return next('Password is required')

    // if(!await func.validatePassword(password)) return next('Password is not valid')

    const Customer = await Customers.findOne({ email_address })

    if(!Customer) {

      const encrypted = await bcrypt.hash(password, 10);

      const data = {
        email_address,
        password: encrypted,
      }

      await Customers.create(data).then((response: object) => {

        const token = jwt.sign(email_address, config.tokenSecret)

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

const login = async(req: CustomRequest, res: Response, next: NextFunction) => {

  try {

    const { email_address, password } = req.body

    if(!password) return next('Password is required')

    // if(!await func.validatePassword(password)) return next('Password is not valid')

    if(!email_address) return next('Email address is required')

    // if(!await func.validateEmail(email_address)) return next('Email Address is not valid')

    const Customer = await Customers.findOne({ email_address })

    if(Customer) {

      if(await bcrypt.compare(password, Customer.password)) {

        const token = jwt.sign(email_address, config.tokenSecret)

        return res.status(200).send({
          status: 200,
          error: false,
          message: 'Customer logged in successfully',
          Customer: Customer,
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

module.exports = {
  register,
  login,
}
