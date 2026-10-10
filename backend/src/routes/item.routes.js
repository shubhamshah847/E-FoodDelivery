import express from 'express'
import { isAuth } from '../middleware/auth.middleware.js'
import {addItem,editItem, getAllItem, getItem} from '../controllers/item.controller.js'
import upload from '../middleware/multer.js'
import searchFood from '../controllers/foodSearch.controller.js'
const router = express.Router()

router.post('/item/create',isAuth,upload.single('image'),addItem)
router.post('/item/edit',isAuth,upload.single('image'),editItem)
router.get('/get-my-items',isAuth,getItem)
router.get('/get-all-items',isAuth,getAllItem)
router.get('/search',isAuth,searchFood)


export default router ;