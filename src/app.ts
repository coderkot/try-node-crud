import express, {Express} from "express"
import {getUsersRouter} from "./routes/users"
import {getTestsRouter} from "./routes/tests"
import {db} from "./mock/db.mock"
import {getRootRouter} from "./routes/root";

export const app: Express = express()

app.use(express.json())

app.use('/', getRootRouter())
app.use('/users', getUsersRouter(db))
app.use('/__test__', getTestsRouter(db))
