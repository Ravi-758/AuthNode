const bcrypt = require("bcrypt");
const User =require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup  =async (req,res)=>{
    try{
        const{name,email,password,role} = req.body;

        const existingUser =await User.find({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exist",

            });
        }

        let hashedPassword;
        try{
            hashedPassword =await bcrypt.hash(password,10);
        }catch(err){
            return res.status(500).json({
                success:false,
                message:"error in hashing password",
            });
        }

        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:"User created successfully",
        });
    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"user cannot be registered",
        });
    }
}


exports.login = async (req,res)=>{
    try{
        const {email,password} =req.body;
        if(!email||!password){
            return res.status(400).json({
                success:false,
                message:'please fill all the detail carefully',
            });
        
        }
        const user =await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registred",
            });
        }

        const payload ={
            email:user.email,
            id:user._id,
            role:user.role,
        };
        if(await bcrypt.compare(password,user.password)){
            let token =jwt.sign(payload,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"2h",
                                }    
                                );
        user.token = token;
        user.password = undefined;
        const options={
            expires:new Date(Date.now() +3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token",token,option).status(200).json({
            success:true,
            token,
            user,
            message:"user loggedin successfully",
        }); 

        }else{
            return res.status(403).json({
                success:false,
                message:"password incorrect",
            })
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'login failure', 
        })
    }
}