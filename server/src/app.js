import express from "express"
import mongoConnect from "./shared/config/db.js"
import cors from "cors"
import rateLimit from "express-rate-limit"

const app = express()
app.use(express.json())


//routes
import ordersRoute from "./features/routers/orders.route.js"
import prodRoute from "./features/routers/products.route.js"
import userRoute from "./features/routers/users.route.js"
import authRoute from "./features/routers/auth.route.js"
import cartRoute from "./features/routers/cart.route.js"


app.use("/auth",authRoute)
app.use("/users",userRoute)
app.use("/products",prodRoute)
app.use("/cart", cartRoute)
app.use("/orders", ordersRoute)

const allowedOrigins = ["http://127.0.0.1:5500"]
const corsOptions = {
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ['GET', 'POST','PUT','PATCH', 'DELETE'],
    origin: function (origin, callback) {
        if(!origin || allowedOrigins.indexOf(origin) !== -1)
        {
            callback
        }
    }
}

app.use(cors(corsOptions))

app.set("trust proxy", 1)


const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15m
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "יותר מדי בקשות"
})

app.use(globalLimiter)

app.use("/", (res) => {
    res.send("fallback..404 - not found")
})

mongoConnect().then(() => app.listen(3005, () => console.log("Server is running..."))).catch(console.error)