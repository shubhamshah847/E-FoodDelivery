import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
const cloudinaryUpload = async(file)=>{
    console.log(file)
    cloudinary.config({ 
   cloud_name:process.env.MY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
})
 try {
   const result = await cloudinary.uploader.upload(file)
   fs.unlinkSync(file)
  return result.secure_url
  } catch (err) {  
    fs.unlinkSync(file)
   // fs.unlinkSync(file)
    console.log("cloudinary uploader:- ",err)
  }
}
export default cloudinaryUpload ;