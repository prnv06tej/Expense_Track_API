const express = require("express");
const router = express.Router()
const {registerUser,loginUser} = require("../controllers/userController.js")
const {protect } = require("../middleware/authMiddleware.js");


router.post("/",registerUser);

router.post("/login",loginUser);

//router.get("/me",protect,getMe);//to get curr user info not yet implemented

module.exports = router;