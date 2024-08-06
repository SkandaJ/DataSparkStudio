const express =  require('express');
const router = express.Router();
const path = require('path');
const DASH = require('../models/dashboards');
const REQ = require('../models/requests');
const User = require('../models/user');
const Dev = require('../models/dev');
router.get('/landing_page', (req, res)=>{
    res.render('landing_page');
});

router.get('/', async (req, res) => {
    try {
        const alldash = await DASH.find({ createdFor: req.user.email });
        const username = await User.findOne({email: req.user.email});
        res.render('home', {
            dash: alldash,
            display_name: username
        });
    } catch (error) {
        return res.render('login');
    }
});
router.get('/signup', (req, res)=>{
    return res.render('signup');
});
router.get('/login', (req, res)=>{
    return res.render('login');
});

router.get('/logout', (req, res) => {
    if (req.cookies?.uid) {
        res.clearCookie('uid', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    }
    if (req.cookies?.did) {
        res.clearCookie('did', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    }
    res.redirect('/landing_page');
});

router.get('/upload', (req, res)=>{
    if(!req.user) return res.redirect('/login');
    return res.render('upload');
});

router.get('/dev_home', async(req, res)=>{
    if(!req.dev) return res.redirect('/login');
    const allreq = await REQ.find().populate('requestedBy', 'email');
    const dev_name = await Dev.findOne({email: req.dev.email})
    return res.render('dev_home', {
        req:allreq,
        display: dev_name
    });
});

router.get('/download', async (req, res) => {
    const filePath = req.query.path;
    const absoluteFilePath = path.join(__dirname, '../', filePath); 
    res.download(absoluteFilePath);
    await REQ.updateOne({ file: filePath }, { $set: { status: 'in-progress' } });
});

router.get('/services', async(req, res) => {
    const service = await DASH.find({});
    return res.render('services', {
        serv: service
    });
});

router.get('/dev_upload', async(req, res)=>{
    if(!req.dev) return res.redirect('/login');
    return res.render('dev_upload');
});

router.get('/status', async(req, res)=>{
    if(!req.user) return res.redirect('/login');
    const allreq = await REQ.find({ requestedBy: req.user._id })
    const username = await User.findOne({email: req.user.email})
    return res.render('status', {
        req:allreq,
        uname: username
    });
});

module.exports = router;