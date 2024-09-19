import {app} from "./app"

const port: number = 3003

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})

module.exports = app //vercel
