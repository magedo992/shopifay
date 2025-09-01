const mongoose=require('mongoose');
const categorySchema=new mongoose.Schema({
    name:{type:String,requried:true},
    description:{
        type:String,
        required:[true,'descirption is requried']
    }

})

module.exports=mongoose.model('Category',categorySchema);