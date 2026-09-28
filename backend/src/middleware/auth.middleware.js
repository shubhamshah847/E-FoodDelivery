import jwt from 'jsonwebtoken'
export const isAuth = (req,res,next)=>{
    const {token} = req.cookies
    if(!token) return res.status(401).json({message:"your are not a user"})
    try {
        const decoded = jwt.verify(token,process.env.JWT_WEB_TOKEN) 
        req.user=decoded.id
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            message:"you are not verified user"
        })
    }
    
     


}