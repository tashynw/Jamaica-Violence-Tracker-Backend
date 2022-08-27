import * as express from 'express';
const fs = require('fs');
const router = express.Router();
const {Articles} = require('../models/Articles');

router.get('/',async (req,res)=>{
    const stringifiedArticles = await Articles.findOne({ title:'articles' }).exec();
    res.json(JSON.parse(stringifiedArticles.articleStringified))
})

module.exports = router;