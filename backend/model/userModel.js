import mongoose from 'mongoose'
import mongooseUniqueValidator from "mongoose-unique-validator";
const userSchema = mongoose.Schema(
    {
         name:
        {
            type:String,
            lowercase:true,
            trim:true,
            required:[true,'name is Required']
        },
        email:
        {
            
        type:String,
        lowercase:true,
        unique:true,
        required:[true,"Email is required"],
        trim:true,

        },
         password:{
        type: String,
        required: [true,"Password is Required"],
        minlength:5,
        trim: true,
         },
        mobile:{
        type: String,
        required:[true,"Mobile is Required"],
        minlength:10,
         maxlength:10,
        trim: true,
    },
    gender: {
        type: String,
        required: [true,"Gender is required"],
    },
    role:String,
    info:String,
    

    }
)
userSchema.plugin(mongooseUniqueValidator);
const userSchemaModel = mongoose.model('user',userSchema);
export default userSchemaModel;