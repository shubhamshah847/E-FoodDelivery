import itemModel from "../models/item.model.js";
const searchFood = async (req, res) => {
  console.log("_id:",req.user)
  try {
    const { query } = req.query;
    console.log(query)
    const foods = await itemModel.find({
      $or: [
        {
          name: {
            $regex: query,
            $options: "i"
          }
        },
        {
          category: {
            $regex: query,
            $options: "i"
          }
        },
        {
          foodType:{
            $regex: query,
            $options: "i"
          }
        }
      ]
    });

    res.status(200).json(foods);
    

  } catch (error) {
    res.status(500).json({
      message: "Search failed"
    });
  }
};
export default  searchFood