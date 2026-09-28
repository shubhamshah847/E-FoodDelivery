import { flattenNestedArrayItems } from "ioredis/built/replyTransformers.js"
import itemModel from "../models/item.model.js"
import shopModel from "../models/shop.model.js"
import cloudinaryUpload from "../utils/cloudinary.js"

export const addItem = async (req, res) => {
    try {

        const {
            name,
            category,
            price,
            discount,
            foodType
        } = req.body;

        // Required fields
        if (!name || !category || !price || !foodType) {
            return res.status(400).json({
                message: "All required fields are required"
            });
        }

        // Check shop
        const shop = await shopModel.findOne({
            owner: req.user
        });

        if (!shop) {
            return res.status(404).json({
                message: "Shop not found"
            });
        }

        // Upload image
        if (!req.file) {
            return res.status(400).json({
                message: "Food image is required"
            });
        }

        const image = await cloudinaryUpload(req.file.path);

        // Create item
        const item = await itemModel.create({
            name,
            image,
            shop: req.user,
            category,
            price: Number(price),
            discount: Number(discount) || 0,
            foodType
        });

        return res.status(201).json({
            message: "Item created successfully",
            item
        });

    } catch (err) {

        console.log("Item not created:", err);

        return res.status(500).json({
            message: "Item not created",
            error: err.message
        });
    }
};
export const editItem = async(req,res)=>{
    const _id = req.user
    if(!_id){
        return res.status(404).json({
            message:"id not found"
        })
    }
    try {
      
        let item =  itemModel.findOneAndUpdate(_id,{
            name, shop, category, price, foodType,discount
        },{new:true})
        if(!item) return res.status(404).json({message:"item not found"})
        res.status(201).json({
            message:"item edited successfully",item
        })
    } catch (err) {
        res.status(500).json({messgae:"item not edited . try again !!"})
    }
   

}
export const getItem = async(req,res)=>{
    const id = req.user
    if(!id){
        return res.staus(401).json({
            message:"You are not authenticated"
        })
    }
    try{
    // const shop = await shopModel.findOne({owner:id})
    //    if (!shop) {
    //         return res.status(404).json({
    //             message: "Shop not found"
    //         });
    //     }

    const items = await itemModel.find({shop:id})
    console.log("items",items)
    if(!items) return res.status(404).json({message:"items not found"})
    
   res.status(200).json({messsage:"items fetched succesfully",items})
    }
   catch(err){
    console.log("get- items:",err)
    res.staus(500).json({message:"some thing went wrong "})
}

}
export const getAllItem = async(req,res)=>{

    try{
    const items = await itemModel.find()
    
    console.log("items:",items)
    if(!items) return res.status(404).json({message:"items not found"})
    
   res.status(200).json({messsage:"items fetched succesfully",items})
    }
   catch(err){
    console.log("get- items:",err)
    res.staus(500).json({message:"some thing went wrong "})
}
}