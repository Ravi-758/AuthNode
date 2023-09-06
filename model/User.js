const mongoose = require("mongoose");

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,

    },
    password:{
        type:String,
        reuired:true,
    },
    role:{
        type:String,
        enum:["Admin","Student","Visitor"],

    }
})

module.exports = mongoose.model("user",userSchema);
