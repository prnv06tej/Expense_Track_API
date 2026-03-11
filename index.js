const express = require("express");
const dotenv = require("dotenv");

dotenv.config();  // load dot env before 

const connectDB = require("./config/db.js");
const port = process.env.PORT || 6000;



connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/api/user",require("./routes/user.routes.js"));
app.use("/api/expenses",require("./routes/expense.routes.js"));

//global error handeling error middle ware 
app.use((err,req,res,next)=>{
    const statusCode = res.statusCode ? res.statusCode :500;
    res.status(statusCode);
    res.json({
        message:err.message,
        stack:process.env.NODE_ENV === "producion"? null : err.stack,
    });
});

app.listen(port,()=>console.log(`Server started on port ${port}`));
