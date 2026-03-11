const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const generateToken = (id) =>{
    return jwt.sign({ id },
        process.env.JWT_SECRET,
        {expiresIn:"30d"}
    );
};

const registerUser = async (req,res)=>{
    try{
        const {name,email,password} = req.body;

        const userExist = await User.findOne({email});
        if(userExist) {
            return res.status(400).json({message:"User Already Exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        });
        //return id and info of reg
        res.status(200).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            message:"User Registered Sucessfully , Copy _id to use later"
        });
    }
    catch(error){
       res.status(500).json({message:error.message});
    }
};

const loginUser = async (req,res) =>{
    try{
        const {email,password}=req.body;

        const user = await User.findOne({email});

        if(user && (await bcrypt.compare(password,user.password))) {
            res.json({
                _id:user.id,
                name:user.name,
                email:user.email,
                token:generateToken(user._id),
            });
        }else{
            res.status(400).json({message:"Invalid Credentials"});
        }
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

module.exports = {
    registerUser,
    loginUser
};