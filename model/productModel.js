const mongoose=require('mongoose');
const productSchema=new mongoose.Schema({
name:{type:String,
    required:true
},
description:{
    type:String

},
catId:{
    type:mongoose.Schema.ObjectId,
    ref:'Category'
},
price:{
    type:Number,
    required:true
},
 stock: { type: Number, default: 0 ,min:0},
  images: [{ type: String }],
  imagePublicIds: [String],
},{timestamps:true});

module.exports=mongoose.model('Product',productSchema);