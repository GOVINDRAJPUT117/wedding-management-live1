import '../connection/dbconfig.js'
import categorySchemaModel from '../model/category.js'
import APIResponse from '../response/APIResponse.js';


export const saveCategory = async (req, res, next) => {
  try {
    const category_detail = req.body;

  
    const existingCategory = await categorySchemaModel.findOne();
    if (existingCategory) {
      
      return res.status(400).json(new APIResponse(false, null, "Category already exists"));
    }

    
    const cat_list = await categorySchemaModel.find();
    const len = cat_list.length;
    const _id = len === 0 ? 1 : cat_list[len - 1]._id + 1;

    const newCategory = { ...category_detail, _id };

 
    const result = await categorySchemaModel.create(newCategory);

   
    return res.status(201).json(new APIResponse(true, result, "Category Saved Successfully"));

  } catch (err) {
    console.log("Save Category Error:", err);

   
    return res.status(500).json(new APIResponse(false, err, "Category Not Saved"));
  }
};



