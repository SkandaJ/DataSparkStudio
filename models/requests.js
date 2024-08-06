const mongoose = require('mongoose');
const req = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    file:{
        type: String,
        required: true,
    },
    description:{
        type:String,
        required:true,
    },
    requestedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
    },
    status: {
        type: String,
        default: 'pending'
    },
});

const REQ = mongoose.model("request", req);
module.exports = REQ;