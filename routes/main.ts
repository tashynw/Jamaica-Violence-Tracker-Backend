import { getRelatedArticles } from "../functions/functions";
import * as express from 'express';
const fs = require('fs');
const router = express.Router();

router.get('/',async (req,res)=>{
    const data = fs.readFileSync('results/articles.txt',{encoding:'utf8', flag:'r'});
    res.json(JSON.parse(data))
})

module.exports = router;