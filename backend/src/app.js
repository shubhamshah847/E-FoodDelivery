import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import Redis from 'ioredis'
import connectToDb from './db/db.js'
import authRoutes from '../src/routes/auth.routes.js'
import shopRoutes from '../src/routes/shop.routes.js'
import itemRoutes from '../src/routes/item.routes.js'
import cookieParser from 'cookie-parser'

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
app.use('/api',itemRoutes)




export default app ;