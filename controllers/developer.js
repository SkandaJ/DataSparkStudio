const Dev = require('../models/dev');
const DASH = require('../models/dashboards');
const REQ = require('../models/requests');
const User = require('../models/user');
const {v4: uuidv4} = require('uuid');
const{setDev} = require('../service/auth');


async function handleDevLogin(req, res){
    const {email, password} = req.body;
    const dev = await Dev.findOne({email, password,});
    if(!dev)
        return res.render('login', {
        error:"Invalid username or password",
    });
    const sessionId = uuidv4();
    setDev(sessionId, dev);
    res.cookie('did', sessionId);
    return res.redirect('/dev_home');

}

async function handleDevUpload(req, res) {
    const { title, createdFor, url } = req.body;

    try {
        const user = await User.findOne({ email: createdFor });
        if (!user) {
            return res.render('dev_upload', {
                error: 'User not found.',
            });
        }

        const reqToUpdate = await REQ.findOne({
            title: title,
            requestedBy: user._id,
            status: 'in-progress'
        });
        if (!reqToUpdate) {
            return res.render('dev_upload', {
                error: 'Request not found or is closed.',
            });
        }

        const result = await REQ.updateOne(
            { _id: reqToUpdate._id },
            { $set: { status: 'completed', completedUrl: url } }
        );

        if (result.modifiedCount === 0) {
            return res.render('dev_upload', {
                error: 'Failed to update the request.',
            });
        }

        await DASH.create({
            url,
            createdFor,
        });

        return res.render('dev_upload', {
            success: 'Dashboard has been uploaded successfully',
        });

    } catch (error) {
        console.error('Error:', error); 
        return res.render('dev_upload', {
            error: 'An error occurred while completing the request.',
        });
    }
}


module.exports={
    handleDevLogin,
    handleDevUpload,
}