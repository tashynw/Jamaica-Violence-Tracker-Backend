import mongoose from "mongoose";
const { Schema } = mongoose;

const articleSchema = new Schema({
  key: String,
  text: String,
  link: String,
  countryCode: String,
});

const Articles = mongoose.model("Articles", articleSchema);
module.exports = {
  Articles,
};
