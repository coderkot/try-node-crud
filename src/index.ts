import express from 'express'
import {HTTP_STATUS} from './consts'

const app = express()
const port = 3003
const db = {
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

app.get('/users', (req, res) => {
    let foundUsers = db.users

    if (req.query.name) {
        foundUsers = foundUsers.filter(
            user => user.name.toLowerCase().includes(req.query.name as string)
        )
    }

    res.json(foundUsers)
})

app.get('/users/:id', (req, res) => {
    const foundUser = db.users.find(
        user => user.id === +req.params.id
    )

    if (!foundUser) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
        return
    }

    res.json(foundUser)
})

app.post('/users', (req, res) => {
    if (!req.body.name) {
        res.status(HTTP_STATUS.BAD_REQUEST).send('Name cannot be empty')
        return
    }

    const createdUser =  {
        id: +new Date(),
        name: req.body.name as string
    }

    db.users.push(createdUser)
    res.status(HTTP_STATUS.CREATED).json(createdUser)
})

app.delete('/users/:id', (req, res) => {
    db.users =  db.users.filter(
        user => user.id !== +req.params.id
    )

    res.sendStatus(HTTP_STATUS.NO_CONTENT)
})

app.put('/users/:id', (req, res) => {
    if (!req.body.name) {
        res.status(HTTP_STATUS.BAD_REQUEST).send('Name cannot be empty')
        return
    }

    const foundUser = db.users.find(
        user => user.id === +req.params.id
    )

    if (!foundUser) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
        return
    }

    foundUser.name = req.body.name as string
    res.sendStatus(HTTP_STATUS.NO_CONTENT)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})