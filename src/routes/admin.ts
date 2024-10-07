import express from "express"
import {authCheckPointMiddleWare} from "../middlewares/authCheckPoint"

export const getAdminRouter = (): express.Router => {
    const router = express.Router()

    router.route('/')
        .get(
            authCheckPointMiddleWare,
            (req: express.Request, res: express.Response) => {
                res.status(200).send('Admin panel ' + process.env.PG_USER)
            })

    return router
}