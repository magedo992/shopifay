const express=require('express');
const router=express.Router();
const category=require('../controller/categoryController');



router.route('/category').get(category.getAll).post(category.createCategory);
router.route('/category/:Id').put(category.updateCategory).delete(category.deleteCategory)
module.exports=router;