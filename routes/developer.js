const express = require('express');
const {handleDevLogin, handleDevUpload}=require("../controllers/developer");
const router=express.Router();
router.post('/login', handleDevLogin);
router.post('/dev_upload', handleDevUpload);

module.exports=router;