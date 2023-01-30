import {NextFunction, Response, Request} from "express";
import * as dotenv from 'dotenv';
import customers from "../../models/customerModel";
import * as functions from "../../helpers/functions";

dotenv.config();


import Stripe from "stripe";

// @ts-ignore
const stripe = new Stripe('sk_test_51LysudBXNTMYmqBgC40ZaPMeY7zK0fvza3uB82eiiam26Z59tB7dv71R4uII9xhyDnJQPz4q3bATtAmbhN8mBq3T00olxlXc3w' );

const payment = async (req :Request, res:Response, next:NextFunction) => {

  try {

    const YOUR_DOMAIN = 'http://localhost:4000/membership'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        'card'
      ],
      line_items: [
        {
          // TODO: replace this with the `price` of the product you want to sell
          // price: '{{PRICE_ID}}',
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
    res.redirect(session.url!.toString())

  } catch (err) {
    return next(err)
  }
}

module.exports = {
  payment
}
