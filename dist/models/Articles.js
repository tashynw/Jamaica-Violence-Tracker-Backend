"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const articleSchema = new Schema({
    title: String,
    articleStringified: String
});
const Articles = mongoose_1.default.model('Articles', articleSchema);
module.exports = {
    Articles
};
//# sourceMappingURL=Articles.js.map