import mongoose from "mongoose";
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: String,
  articleStringified: String,
});

const Articles = mongoose.model("Articles", articleSchema);
module.exports = {
  Articles,
};
