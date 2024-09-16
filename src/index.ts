import express, {Express, Request, Response} from 'express'
import {HTTP_STATUS, STATUS_MESSAGES} from './consts'
import {DBType, UsersType} from "./types/types"
import {RequestBody, RequestBodyParam, RequestParams, RequestQuery} from "./types/request-types"
import {UserCreateModel} from "./models/UserCreateModel"
import {UserUpdateModel} from "./models/UserUpdateModel"
import {UserQueryModel} from "./models/GetUserQueryModel"
import {URIUserIdParamsModel} from "./models/URIUserIdParamsModel"
import {getUserViewModel} from "./utils";

const app: Express = express()
const port: number = 3003
const db: DBType = {
    users: [
        {id: 1, name: 'Alex Userson', email: 'alexuser@example.com'},
        {id: 2, name: 'Dima', email: 'dima@example.com'},
        {id: 3, name: 'Ed', email: 'ed@example.com'},
        {id: 4, name: 'Arthur', email: 'art@example.com'},
        {id: 5, name: 'Alex Alexov', email: 'alexalex@example.com'},
        {id: 6, name: 'Ed Brown', email: 'edbr@example.com'},
        {id: 7, name: 'John Doe', email: 'jdoe@example.com'},
    ]
}

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send(STATUS_MESSAGES.WELCOME)
})

app.get('/users', (req: RequestQuery<UserQueryModel>, res: Response<UsersType[]>) => {
    let foundUsers: UsersType[] = db.users

    if (req.query.name) {
        foundUsers = foundUsers.filter(
            user => user.name.toLowerCase().includes(req.query.name)
        )
    }

    res.status(HTTP_STATUS.OK_200).json(foundUsers.map(getUserViewModel))
})

app.get('/users/:id', (req: RequestParams<URIUserIdParamsModel>, res: Response<UsersType>) => {
    const foundUser: UsersType | undefined = db.users.find(
        user => user.id === +req.params.id
    )

    if (!foundUser) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        return
    }

    res.status(HTTP_STATUS.OK_200).json(getUserViewModel(foundUser))
})

app.post('/users', (req: RequestBody<UserCreateModel>, res: Response<UsersType|Object>) => {
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

app.delete('/users/:id', (req: RequestParams<URIUserIdParamsModel>, res: Response) => {
    for (let i = 0; i < db.users.length; i++) {
        if (db.users[i].id === +req.params.id) {
            db.users.splice(i, 1)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
            return
        }
    }

    res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
})

app.put('/users/:id', (req: RequestBodyParam<URIUserIdParamsModel, UserUpdateModel>, res: Response<UsersType|Object>) => {
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

app.delete('/__test__/init-drop-users', (req: Request, res: Response) => {
    db.users = []

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})

export default app
module.exports = app // for vercel