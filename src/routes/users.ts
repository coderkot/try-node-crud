import express, {Response} from "express"
import {HTTP_STATUS, STATUS_MESSAGES} from "../consts"
import {RequestBody, RequestBodyParam, RequestParams, RequestQuery} from "../types/request-types"
import {UserQueryModel} from "../models/GetUserQueryModel"
import {UsersType} from "../types/common-types"
import {getUserViewModel} from "../utils"
import {UserCreateModel} from "../models/UserCreateModel"
import {URIUserIdParamsModel} from "../models/URIUserIdParamsModel"
import {UserUpdateModel} from "../models/UserUpdateModel"
import * as fs from "node:fs"
import {usersRepo} from "../repostories/users-repo"
import {body, validationResult} from "express-validator"

export const getUsersRouter = (): express.Router => {
    const router: express.Router = express.Router()

    router.route('/')
        .get((req: RequestQuery<UserQueryModel>, res: Response<UsersType[]>) => {
            const users = usersRepo.findByName(req.query.name?.toString())

            res.status(HTTP_STATUS.OK_200).json(users.map(getUserViewModel))
        })
        .post(
            body('name').notEmpty(),
            body('email').notEmpty().isEmail(),
            (req: RequestBody<UserCreateModel>, res: Response<UsersType|Object>) => {
                const errors = validationResult(req)

                if (!errors.isEmpty()) {
                    return res.status(HTTP_STATUS.BAD_REQUEST_400).json({errors: errors.array()});
                }

                const createdUser: UsersType = usersRepo.createUser(req.body.name, req.body.email)
                res.status(HTTP_STATUS.CREATED_201).json(getUserViewModel(createdUser))
            })

    router.route('/:id(\\d+)')
        .get((req: RequestParams<URIUserIdParamsModel>, res: Response<UsersType>) => {
            const foundUser: UsersType | undefined = usersRepo.findById(+req.params.id)

            if (!foundUser) {
                res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
                return
            }

            res.status(HTTP_STATUS.OK_200).json(getUserViewModel(foundUser))
        })
        .put(
            body('name').notEmpty(),
            (req: RequestBodyParam<URIUserIdParamsModel, UserUpdateModel>, res: Response<UsersType|Object>) => {
                const errors = validationResult(req)

                if (!errors.isEmpty()) {
                    return res.status(HTTP_STATUS.BAD_REQUEST_400).json({errors: errors.array()})
                }

                const userIsUpdated: boolean = usersRepo.updateUser(+req.params.id, req.body.name)
                if (!userIsUpdated) {
                    res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
                    return
                } else {
                    const foundUser: UsersType | undefined = usersRepo.findById(+req.params.id)
                    res.status(HTTP_STATUS.OK_200).json(getUserViewModel(foundUser as UsersType))
                }
            })
        .delete((req: RequestParams<URIUserIdParamsModel>, res: Response) => {
            usersRepo.deleteUserById(+req.params.id)
                ? res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
                : res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        })

    return router
}