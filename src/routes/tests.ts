import express, {Request, Response} from "express"
import {HTTP_STATUS} from "../consts"
import {usersRepo} from "../repostories/users-repo"

export const getTestsRouter = () => {
    const router: express.Router = express.Router()

    router.delete('/init-drop-users', (req: Request, res: Response) => {
        usersRepo.dropAllUsers()

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    return router
}