const categoryModel=require('../model/categoryModel');
const asyncHandler=require('express-async-handler');
const ErrorHandler=require('../utils/ErrorHandel');

exports.createCategory=asyncHandler(async (req,res,next)=>{
const {name,description}=req.body;

const category=await categoryModel.create({
    name:name.toString(),
    description:description
});
if(category)
    return res.status(201).json({
message:"created successful",
data:category
    })
return next(new ErrorHandler("error in create category",401));
})

exports.deleteCategory=asyncHandler(async (req,res,next)=>{
    const id=req.params.Id;
const category=await categoryModel.findOneAndDelete({_id:id});
console.log(category);

if(category)
{
    return res.status(200).json({
        message:"Deleted Category successed"
    });
}
return next(new ErrorHandler("Categroy not found",404));
});

exports.getAll=asyncHandler(async(req,res,next)=>{

    const category=await categoryModel.find({},{'__v':false});
    res.status(200).json({
        message:"get all category",
        data:category
    })
})

exports.updateCategory=asyncHandler(async(req,res,next)=>{
    const id=req.params.Id;
const category=await categoryModel.findByIdAndUpdate({_id:id},req.body,{new:true});

if(!category)
{
    return next( new ErrorHandler("category not found",404));
}
return res.status(200).json({message:"updated successful"
    ,data:category})
})