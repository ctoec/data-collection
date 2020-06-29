import { NextFunction, Request, Response } from "express";
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

const validate = jwt({
	secret: jwks.expressJwtSecret({
		jwksUri: 'https://winged-keys:5050/.well-known/openid-configuration/jwks',
		// @TODO Add HTTPS support
		strictSsl: false,
	}),
	requestProperty: 'token'
});

const handleError = (
	err: Error,
	_: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.name === 'UnauthorizedError') {
    res.status(401).json({
			status: 401,
			message: 'Unauthorized'
		});
  } else {
		next();
	}
}

const identify = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
 try {
	 const token = req.token;
	 const sub = token.sub;
	 req.sub = sub;
	 next();
 } catch (e) {
	 console.log(e)
	 res.status(500).send({
		 error: e.toString()
	 });
 }
}

export const authenticate = [validate, handleError, identify];