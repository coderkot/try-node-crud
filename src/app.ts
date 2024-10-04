import express, {Express} from "express"
import {getUsersRouter} from "./routes/users"
import {getTestsRouter} from "./routes/tests"
import {getRootRouter} from "./routes/root"
import {getAdminRouter} from "./routes/admin"
import {authCheckPointMiddleWare} from "./middlewares/authCheckPoint"

export const app: Express = express()

app.use(express.json())
// app.use(authCheckPointMiddleWare)

app.use('/', getRootRouter())
app.use('/users', getUsersRouter())
app.use('/admin', getAdminRouter())

app.use('/__test__', getTestsRouter())
