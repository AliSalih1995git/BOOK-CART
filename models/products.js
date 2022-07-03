const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const productSchema=new Schema({
    bookName:String,
    author:String,
    description:String,
    mrp:Number,
    price:Number,
    Discount:Number, 
    stock:Number,
    sub_cateogry:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Sub_category',
        require: true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'category',
        require:true
    },
    image:{
        type:Array
    }


})
const products = mongoose.model('products',productSchema)
module.exports=products