import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import Redis from 'ioredis'
import connectToDb from '../db/db.js'
import authRoutes from '../routes/auth.routes.js'
import shopRoutes from '../routes/shop.routes.js'
import itemRoutes from '../routes/item.routes.js'
import cookieParser from 'cookie-parser'
import orderRoutes from '../routes/order.routes.js'
import paymentRoutes from '../../payment/razroPay/payment.routes.js'

const app = express()
connectToDb()
export const redis = new Redis(process.env.REDIS_URI)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser())
app.use(express.json())
app.use('/auth',authRoutes)
app.use('/api',shopRoutes)
app.use('/user',orderRoutes)
app.use('/api',itemRoutes)
app.use('/payment', paymentRoutes)

export default app ;