const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const adminSchema= new Schema({
    name:String,
    phoneNumber:String,
    email:String,
    password:String,
    pw:String
})
const admin=mongoose.model('admin',adminSchema)
module.exports=admin