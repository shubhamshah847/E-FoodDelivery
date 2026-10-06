import mongoose from 'mongoose'

const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("db connected ")
    } catch (err) {
        console.log("db error :-",err)
        
    }
    
} 
export default connectToDb ;