import { NextFunction, Request, Response } from "express"

export const authCheckPointMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    if (req.query.token) {
        next()
    } else {
        res.status(401).send("No token provided")
    }
}