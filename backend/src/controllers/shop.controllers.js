import upload from "../middleware/multer.js"
import shopModel from "../models/shop.model.js";
import userModel from "../models/user.models.js";
import cloudinaryUpload from "../utils/cloudinary.js";

export const shopController = async (req, res) => {
    try {
        console.log("req.user", req.user)
        const { name, city, state, address, } = req.body
        console.log(name, city, state, address, "req.file: ", req.file)
        // if (!name|| !city || !state || !address ) {
        //     return res.status(400).json({
        //         message: "All values are required"
        //     })
        // }
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        if (!req.file) {
            return res.status(404).json({ message: "file required" })
        }

        let shop = await shopModel.findOne({ owner: req.user })
        console.log("req.file.pathv: ", req.file.file)
        let image = await cloudinaryUpload(req.file?.path)
        if (!shop) {
            shop = await shopModel.create({
                name, city, state, address, image, owner: req.user
            })
        } else {
            shop = await shopModel.findByIdAndUpdate(req.user, {
                name, city, state, address, image, owner: req.user
            }, { new: true }) - sele
        }
        await shop.populate("owner")
        return res.status(201).json(shop)

    } catch (err) {
        console.log("shop not created:- ", err)
        return res.status(500).json({ message: "shop not created " })
    }


}
export const getMyShop = async (req, res) => {
    const userId = req.user
    if (!userId) return res.status(404).json({ message: "userID not found , you are not authenicated" })
    try {
        const user = await userModel.findOne({ _id: userId })
        if (!user.isOwner) return res.status(403).json({ message: "you are not a shop owner ! " })
        const shop = await shopModel.findOne({ owner: userId })
    console.log("shop",shop)
    
         res.status(200).json({message:"succcessfullly fetched ", shop})
    }
        catch (err) {
            console.log("get shop :", err)
            res.status(500).json({
                message:"something went wrong"

            })
        }
}


