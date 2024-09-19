import express, {Request, Response} from "express"
import {HTTP_STATUS} from "../consts"
import {DBType} from "../types/common-types"

export const getTestsRouter = (db: DBType) => {
    const router: express.Router = express.Router()

    router.delete('/init-drop-users', (req: Request, res: Response) => {
        db.users = []

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    return router
}