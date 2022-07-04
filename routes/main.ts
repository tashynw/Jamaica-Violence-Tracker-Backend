import { getRelatedArticles } from "../functions/functions";
import * as express from 'express';
const router = express.Router();

router.get('/',async (req,res)=>{
    const articles = await getRelatedArticles();
    res.json(articles)
})

module.exports = router;