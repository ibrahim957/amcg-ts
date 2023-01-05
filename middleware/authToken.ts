const jwt = require('jsonwebtoken')
import * as dotenv from 'dotenv';
import {NextFunction, Request, Response} from "express";

dotenv.config();

export interface CustomRequest extends Request {
  user?: string;
}

const authToken = (req: CustomRequest, res: Response, next: NextFunction) => {

  let token = req.headers['authorization']

  token = token && token.split(' ')[1]

  if (!token) {

    return res.status(403).send({
      status: 403,
      error: true,
      message: 'Please provide an authentication token'
    })

  }

  jwt.verify(token, process.env.tokenSecret, (err: any, user: any) => {

    if (err) {

      return res.status(401).send({
        status: 401,
        error: true,
        message: 'Invalid authentication token'
      })

    }
    req.user = user
    next()
  })
}

module.exports = authToken
