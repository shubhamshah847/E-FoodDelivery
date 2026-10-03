import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shop"
    },
    category: {
        type: String,
        required: true,
        enum: ["Pizza",
            "Burger",
            "Biryani",
            "North Indian",
            "South Indian",
            "Chinese",
            "Momos",
            "Rolls",
            "Sandwich",
            "Pasta",
            "Noodles",
            "Dosa",
            "Idli",
            "Thali",
            "Desserts",
            "Ice Cream",
            "Cakes",
            "Bakery",
            "Fast Food",
            "Street Food",
            "Healthy Food",
            "Salads",
            "Breakfast",
            "Beverages",
            "Juices",
            "Coffee",
            "Tea",
            "Shakes",
            "Chicken",
            "Mutton",
            "Seafood",
            "Vegetarian", "Vegan"]
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    discount:{
         type:Number,
         min:0,
         max:100,
         default:0
         
    },
    foodType: {
        type: String,
        enum: ["veg", "non-veg"],
        required: true
    },
    quantity:{
        type:Number,
        required:true,
        min:0,default:0
    }
})

const itemModel = mongoose.model("item",itemSchema)

export default itemModel