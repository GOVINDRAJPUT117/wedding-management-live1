import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const catSchema = mongoose.Schema({
    
    catName:{
        type:String,
        lowercase:true,
        trim:true,
        unique:true,
        required:[true,'Category Name is Required']
    }
})

catSchema.plugin(mongooseUniqueValidator);
const catSchemaModel = mongoose.model('category',catSchema);
export default catSchemaModel;