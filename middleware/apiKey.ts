import * as dotenv from 'dotenv';
import {NextFunction, Request, Response} from "express";

dotenv.config();

const apiKey = function (req: Request, res: Response, next: NextFunction) {

	const token = req.headers['x-api-key']

	if (!token) {

		return res.status(403).send({
			status: 403,
			error: true,
			message: 'Please provide an api key'
		})

	} else if (token !== process.env.apiKey) {

		return res.status(401).send({
			status: 401,
			error: true,
			message: 'Invalid api key'
		})

	} else {
		next()
	}

}

module.exports = apiKey
