import express, {Request, Response} from "express"
import {STATUS_MESSAGES} from "../consts"

export const getRootRouter = (): express.Router => {
    const router: express.Router = express.Router()

    router.get('/', (req: Request, res: Response) => {
        res.send(STATUS_MESSAGES.WELCOME)
    })

    return router
}