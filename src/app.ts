import express, {Express} from "express"
import {getUsersRouter} from "./routes/users"
import {getTestsRouter} from "./routes/tests"
import {getRootRouter} from "./routes/root"

export const app: Express = express()

app.use(express.json())

app.use('/', getRootRouter())
app.use('/users', getUsersRouter())
app.use('/__test__', getTestsRouter())
