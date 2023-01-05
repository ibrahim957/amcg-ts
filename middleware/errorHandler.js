"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(400).send({
        status: 400,
        error: true,
        message: err
    });
};
module.exports = errorHandler;
