const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SubcategorySchema= new Schema({
    Sub_category:String,
    category:String
});
const Sub_category=mongoose.model('Sub_category',SubcategorySchema)
module.exports=Sub_category