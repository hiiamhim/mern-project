const bcryptjs = require("bcryptjs");
const async = require("hbs/lib/async");
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const res = require("express/lib/response");
const formSchema=new mongoose.Schema({
  firstname:{
      type:String,
      required:true,

  },
  lastname:{
      type:String,
      required:true,
  },
  email:{
      type:String,
      required:true,
      unique:true,

  },
  password:{
      type:String,
      required:true,

  },
  cpassword:{
    type:String,
    required:true,
    
},
number:{
    type:Number,
    
},
gender:{
    type:String,
    required:true
},
tokens:[{
    token:{
    type:String,
    required:true
}
}]

})

formSchema.methods.generateAuthToken=async function(){
    try{
const token1 =jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
this.tokens=this.tokens.concat({token:token1});
await this.save();
return token1 ;

    }
    catch(error){
        res.send("error"+error)
    }
}

formSchema.pre("save",async function(next){

    if(this.isModified("password")){
        // const passwordHash=await bcryptjs.hash(password,10);
        this.password=await bcryptjs.hash(this.password,10);
        this.cpassword=await bcryptjs.hash(this.password,10);
    }
   
    next();
})

const Fodel=new mongoose.model("Form",formSchema);


module.exports=Fodel;