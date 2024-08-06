const express = require('express');
const multer = require('multer');
const {handleUserSignUp, handleUserLogin, handleUpload}=require("../controllers/user");
const {UserAuth}  = require('../middlewares/auth');
const storage = multer.diskStorage({
    destination: function (req, res, cb){
        return cb(null, './uploads');
    },
    filename: function (req, file, cb){
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({storage});
const router=express.Router();
router.post('/signup', handleUserSignUp);
router.post('/login', handleUserLogin);
router.post('/upload', upload.single('file'), UserAuth, handleUpload);
module.exports=router;