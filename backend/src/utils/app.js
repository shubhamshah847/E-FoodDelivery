import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import connectToDb from '../db/db.js'
import authRoutes from '../routes/auth.routes.js'
import shopRoutes from '../routes/shop.routes.js'
import itemRoutes from '../routes/item.routes.js'
import cookieParser from 'cookie-parser'
import orderRoutes from '../routes/order.routes.js'
import paymentRoutes from '../../payment/razroPay/payment.routes.js'

const app = express()
connectToDb()
app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Food Delivery Tracking API is running' })
})
app.use(cors({
  origin: "https://yumzo-food.vercel.app",
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
