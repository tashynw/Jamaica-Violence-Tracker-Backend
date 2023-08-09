import * as express from "express";
import { updateArticleResults } from "../functions/functions";
const fs = require("fs");
const router = express.Router();
const { Articles } = require("../models/Articles");

router.get("/", async (req, res) => {
  const stringifiedArticles = await Articles.findOne({
    title: "articles",
  }).exec();
  return res.json(JSON.parse(stringifiedArticles.articleStringified));
});

router.get("/cron", async (req, res) => {
  await updateArticleResults();
  return res.json({ message: "Successful" });
});

module.exports = router;
