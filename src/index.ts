import express from "express"
import { defaultErrorHandler } from "./middlewares/error.middlewares";
import databaseService from "./services/database.service";
import usersRouter from "./routes/user.routes";
import walletsRouter from "./routes/wallet.routes";
import cors from "cors"
import categoriesRouter from "./routes/category.routes";
import transactionsRouter from "./routes/transaction.routes";
const app = express()
app.use(express.json())
app.use(cors({}))
databaseService.connect().then(() => {
})
app.use("/users", usersRouter)
app.use("/wallets", walletsRouter)
app.use("/categories", categoriesRouter)
app.use("/transactions", transactionsRouter)
app.use(defaultErrorHandler)

app.listen(3001, () => {
    console.log("App listening in 3000");

})