import * as express from "express";
import { updateArticleResults } from "../functions/functions";
const router = express.Router();
const { Articles } = require("../models/Articles");

router.get("/articles/:countryCode", async (req, res) => {
  const countryCode = req.params.countryCode;
  if (!countryCode) return res.status(400).json({ message: "Invalid request" });

  try {
    const articles = await Articles.find({
      countryCode: countryCode.trim().toUpperCase(),
    }).exec();

    return res.status(200).json(articles);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.toString() });
  }
});

router.get("/cron", async (req, res) => {
  try {
    await updateArticleResults();
    return res.status(200).json({ message: "Successful" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.toString() });
  }
});

module.exports = router;
