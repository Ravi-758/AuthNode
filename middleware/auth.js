const jwt = require("jsonwebtoken");

reuqire("dotenv").config();

exports.auth =(req,res,next)=>{
    try{
        const token =req.body.token||req.cookie.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token missing',
            })
        }

        try{
            const decode =jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);

            req.user =decode;
        }catch(error){
            console.log()
            return res.status(401).json({
                success:false,
                message:"token is invalide",
            });
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"something went wrong while verfiying the token",
        });
    }
}

exports.isStudent=(req,res,next)=>{
    try{
        if(req.user.role !="Student"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for student",
            });
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role is not matching",
        })
    }
}


exports.isAdmin = (req,res,next)=>{
    try{
        if(req.user.role !="Admin"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Admin",
            });
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role is not matching",
        })
    }
}
