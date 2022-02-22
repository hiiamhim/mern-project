require('dotenv').config();
const express=require("express")
const app=express();
require("./db/conn");
const path=require("path")
const port =process.env.PORT || 8000;
const hbs=require("hbs");
const Fodel=require("./models/form");
const bcryptjs = require("bcryptjs");

const static_path=path.join(__dirname,"../public");
const view_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");
//serving static files to express
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",view_path);
hbs.registerPartials(partials_path);
//for express to read json files
app.use(express.json());
app.use(express.urlencoded({extended:false}))

console.log(process.env.SECRET_KEY)

app.get("/",(req,res)=>{
    res.render("index.hbs");
})

app.get("/login",(req,res)=>{
    res.render("login.hbs")
})


app.post("/login",async(req,res)=>{
    try{
 const email=req.body.email;
 const password=req.body.password;
 const useremail=await Fodel.findOne({email:email});
 const compare=bcryptjs.compare(useremail.password,password);
 const token=await useremail.generateAuthToken();
   console.log(token)
 if(compare){
     res.status(201).render("index.hbs")
 }
 else{
     res.status(400).send("Password is incorrect");
 }

    }
    catch(err){
        res.status(400).send("Invalid Email")
    }
})

app.get("/register",(req,res)=>{
    res.render("register.hbs")
})

app.post("/register",async(req,res)=>{
try{
   const password=req.body.password;
   const cpassword=req.body.cpassword;
 
    
   if(password===cpassword){
   const data=new Fodel({
       firstname:req.body.firstname,
       lastname:req.body.lastname,
       email:req.body.email,
       password:password,
       cpassword:cpassword,
       number:req.body.number,
       gender:req.body.gender
   })

   //password hashing
   //concept of middleware -work bw two things

   const token =await data.generateAuthToken();
   console.log(token)

   const dataGet=await data.save();

   res.render("index.hbs");
   }
   else{
       res.send("Password is not matching")
   }
  
    
    
}
catch(err){
    res.status(400).send(err);
}

})



// const bcryptjs=require("bcryptjs");

// const securePassword=async(password)=>{
//    const passwordHash=await bcryptjs.hash(password,10);
//    console.log(passwordHash);
//    const passwordMatch=await bcryptjs.compare(password,passwordHash);
//    console.log(passwordMatch)
// }

// securePassword("himmi@123");





app.listen(port,()=>{
 console.log(`Server is running at ${port} port `)
})