const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    block:{
        type:Boolean,
    },
    address:[{
        fname:String,
        lname:String,
        house:String,
        towncity:String,
        district:String,
        state:String,
        pincode:Number, 
        email:String,
        mobile:String
    }],
  
})
const user=mongoose.model('user',UserSchema)
module.exports=user