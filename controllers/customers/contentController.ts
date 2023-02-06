import {NextFunction, Response, Request} from "express";
import * as dotenv from 'dotenv';
import customers from "../../models/customerModel";
import * as functions from "../../helpers/functions";

dotenv.config();


import Stripe from "stripe";
import {CustomRequest} from "../../middleware/authToken";

// @ts-ignore
const stripe = new Stripe('sk_test_51LysudBXNTMYmqBgC40ZaPMeY7zK0fvza3uB82eiiam26Z59tB7dv71R4uII9xhyDnJQPz4q3bATtAmbhN8mBq3T00olxlXc3w' );

const payment = async (req :Request, res:Response, next:NextFunction) => {

  try {

    const YOUR_DOMAIN = 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        'card'
      ],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AMCG Research'
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

const research = async(req :CustomRequest, res:Response, next:NextFunction) => {
  try {

    const email_address = req.user

    let customer: any = await customers.findOne({email_address: email_address})

    if (!customer) {
      return next('Customer not found')
    }

    const {keywords} = req.body

    if(!keywords){
      return next("Keywords are required")
    }

    return res.status(200).send({
      status: 200,
      error: false,
      message: 'Research successful'
    })

  } catch (err) {
    return next(err)
  }
}

const subscriptionPayment = async (req :Request, res:Response, next:NextFunction) => {

  try {

    const YOUR_DOMAIN = 'http://localhost:3000'

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
            unit_amount: 200
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
  payment,
  research,
  subscriptionPayment,
  subscribe
}
