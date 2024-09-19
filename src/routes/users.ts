import express, {Response} from "express"
import {HTTP_STATUS, STATUS_MESSAGES} from "../consts"
import {RequestBody, RequestBodyParam, RequestParams, RequestQuery} from "../types/request-types"
import {UserQueryModel} from "../models/GetUserQueryModel"
import {DBType, UsersType} from "../types/common-types"
import {getUserViewModel} from "../utils"
import {UserCreateModel} from "../models/UserCreateModel"
import {URIUserIdParamsModel} from "../models/URIUserIdParamsModel"
import {UserUpdateModel} from "../models/UserUpdateModel"
import * as fs from "node:fs"

export const getUsersRouter = (db: DBType): express.Router => {
    const router: express.Router = express.Router()

    router.route('/')
        .get((req: RequestQuery<UserQueryModel>, res: Response<UsersType[]>) => {
            let foundUsers: UsersType[] = db.users

            if (req.query.name) {
                foundUsers = foundUsers.filter(
                    user => user.name.toLowerCase().includes(req.query.name)
                )
            }

            res.status(HTTP_STATUS.OK_200).json(foundUsers.map(getUserViewModel))
        })
        .post((req: RequestBody<UserCreateModel>, res: Response<UsersType|Object>) => {
            if (!req.body.name || !req.body.email) {
                res.status(HTTP_STATUS.BAD_REQUEST_400).send(STATUS_MESSAGES.EMPTY_DATA)
                return
            }

            const createdUser: UsersType =  {
                id: +new Date(),
                name: req.body.name,
                email: req.body.email,
            }

            db.users.push(createdUser)
            res.status(HTTP_STATUS.CREATED_201).json(getUserViewModel(createdUser))
        })

    router.route('/download')
        .get((req: any, res: any) => {
            const writeStream = fs.createWriteStream("./Users.txt");
            const content = db.users.map((user: UsersType) => {
                return {
                    name: user.name,
                    email: user.email,
                }
            })

            content.forEach((user: any) => {
                writeStream.write(`Name: ${user.name}, Email: ${user.email}\n`);
            })
            writeStream.end();

            res.download("./Users.txt");
        })

    router.route('/:id(\\d+)')
        .get((req: RequestParams<URIUserIdParamsModel>, res: Response<UsersType>) => {
            const foundUser: UsersType | undefined = db.users.find(
                user => user.id === +req.params.id
            )

            if (!foundUser) {
                res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
                return
            }

            res.status(HTTP_STATUS.OK_200).json(getUserViewModel(foundUser))
        })
        .put((req: RequestBodyParam<URIUserIdParamsModel, UserUpdateModel>, res: Response<UsersType|Object>) => {
            if (!req.body.name) {
                res.status(HTTP_STATUS.BAD_REQUEST_400).send(STATUS_MESSAGES.BODY_EMPTY_NAME)
                return
            }

            const foundUser: UsersType | undefined = db.users.find(
                user => user.id === +req.params.id
            )

            if (!foundUser) {
                res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
                return
            }

            foundUser.name = req.body.name
            res.status(HTTP_STATUS.OK_200).json(getUserViewModel(foundUser))
        })
        .delete((req: RequestParams<URIUserIdParamsModel>, res: Response) => {
            for (let i = 0; i < db.users.length; i++) {
                if (db.users[i].id === +req.params.id) {
                    db.users.splice(i, 1)
                    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
                    return
                }
            }

            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        })

    return router
}