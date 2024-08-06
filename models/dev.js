const mongoose=require('mongoose');
const devSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
},
{timestamps:true});


const Dev=mongoose.model('developers', devSchema);
module.exports=Dev;