import {NextFunction, Response, Request} from "express";
import * as dotenv from 'dotenv';
import customers from "../../models/customerModel";
import historys from "../../models/historyModel";

dotenv.config();


import Stripe from "stripe";
import {CustomRequest} from "../../middleware/authToken";
import {generateMemes} from "../../src";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const research = async(req :CustomRequest, res:Response, next:NextFunction) => {
  try {

    const email_address = req.user

    let customer: any = await customers.findOne({email_address: email_address})

    if (!customer) {
      return next('Customer not found')
    }

    if(!customer.status.subscribed){
      return next('Customer not Subscribed')
    }

    const {keywords} = req.body

    if(!keywords){
      return next("Keywords are required")
    }

    let array: string[] = []

    await generateMemes(keywords).then(async(response)=>{
      response.forEach(function(arrayItem){
        const b64 = arrayItem.toString('base64');
        array.push(b64)
      })

      await historys.create({keywords:keywords,customer_id:customer._id,memes:array})

      return res.status(200).send({
        status: 200,
        error: false,
        message: 'Research successful',
        response: array
      })
    })

  } catch (err) {
    return next(err)
  }
}

const history = async(req :CustomRequest, res:Response, next:NextFunction) => {
  try {

    const email_address = req.user

    let customer: any = await customers.findOne({email_address: email_address})

    if (!customer) {
      return next('Customer not found')
    }

    await historys.find({customer_id:customer._id}).then((response)=>{
    
      return res.status(200).send({
        status: 200,
        error: false,
        message: 'History retreived successfully',
        response: response
      })
    })

  } catch (err) {
    return next(err)
  }
} 

const subscriptionPayment = async (req :Request, res:Response, next:NextFunction) => {

  try {

    const YOUR_DOMAIN = process.env.FRONT_END_LINK

    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        'card'
      ],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AMCG Subscription'
            },
            unit_amount: 100
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });
    res.send(session.url)

  } catch (err) {
    return next(err)
  }
}

const subscribe = async(req :CustomRequest, res:Response, next:NextFunction) => {

  try {

    const email_address = req.user

    let customer: any = await customers.findOne({email_address: email_address})

    if (!customer) {
      return next('Customer not found')
    }

    customer.status.subscribed = true

    await customer.save().then(() => {

      return res.status(200).send({
        status: 200,
        error: false,
        message: 'User Subscribed',
      })

    }).catch((err: any) => {
      return next(err)
    })

  } catch (err) {
    return next(err)
  }
}

module.exports = {
  research,
  history,
  subscriptionPayment,
  subscribe
}
