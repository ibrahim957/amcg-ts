import {NextFunction, Request, Response} from "express";

const errorHandler = (err: Error,req: Request, res: Response, next: NextFunction) => {

	console.error(err)

	res.status(400).send({
		status: 400,
		error: true,
		message: err
	})

}

module.exports = errorHandler
