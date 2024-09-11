import express, {Express, Request, Response} from 'express'
import {HTTP_STATUS} from './consts'
import {DBType, User, UsersList} from "./types";

const app: Express = express()
const port: number = 3003
const db: DBType = {
    users: [
        {id: 1, name: 'Alex Userson'},
        {id: 2, name: 'Dima'},
        {id: 3, name: 'Ed'},
        {id: 4, name: 'Arthur'},
        {id: 5, name: 'Alex Alexov'},
        {id: 6, name: 'Ed Brown'},
    ]
}

app.use(express.json())

app.get('/users', (req: Request, res: Response) => {
    let foundUsers: UsersList = db.users

    if (req.query.name) {
        foundUsers = foundUsers.filter(
            user => user.name.toLowerCase().includes(req.query.name as string)
        )
    }

    res.json(foundUsers)
})

app.get('/users/:id', (req: Request, res: Response) => {
    const foundUser: User | undefined = db.users.find(
        user => user.id === +req.params.id
    )

    if (!foundUser) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        return
    }

    res.json(foundUser)
})

app.post('/users', (req: Request, res: Response) => {
    if (!req.body.name) {
        res.status(HTTP_STATUS.BAD_REQUEST_400).send('Name cannot be empty')
        return
    }

    const createdUser: User =  {
        id: +new Date(),
        name: req.body.name as string
    }

    db.users.push(createdUser)
    res.status(HTTP_STATUS.CREATED_201).json(createdUser)
})

app.delete('/users/:id', (req: Request, res: Response) => {
    for (let i = 0; i < db.users.length; i++) {
        if (db.users[i].id === +req.params.id) {
            db.users.splice(i, 1)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
            return
        }
    }

    res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
})

app.put('/users/:id', (req: Request, res: Response) => {
    if (!req.body.name) {
        res.status(HTTP_STATUS.BAD_REQUEST_400).send('Name cannot be empty')
        return
    }

    const foundUser: User | undefined = db.users.find(
        user => user.id === +req.params.id
    )

    if (!foundUser) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        return
    }

    foundUser.name = req.body.name as string
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})