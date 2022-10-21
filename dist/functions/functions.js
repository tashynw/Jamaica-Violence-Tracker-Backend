"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedArticles = exports.updateArticleResults = void 0;
var cheerio = require('cheerio');
const axios = require('axios').default;
const fs = require('fs');
const contextJson = require('../context.json');
const { Articles } = require('../models/Articles');
async function updateArticleResults() {
    const articles = await getRelatedArticles();
    const response = await Articles.updateOne({ title: 'articles' }, { articleStringified: JSON.stringify(articles) });
    if (!response.matchedCount && !response.modifiedCount) {
        const response = await Articles.create({ title: 'articles', articleStringified: JSON.stringify(articles) });
    }
}
exports.updateArticleResults = updateArticleResults;
const getRelatedArticles = async () => {
    const urls = contextJson.websitesToCrawl;
    let linkArray = [];
    for (let url of urls) {
        await axios.get(url)
            .then((response) => {
            let $ = cheerio.load(response.data);
            let links = $('a');
            $(links).each((i, link) => {
                if (includesText($(link).text()) && !containsWordsToIgnore($(link).text())) {
                    linkArray.push({ id: getArticleId(url), text: $(link).text().trim(), link: getArticleLink($(link).attr('href'), getArticleId(url)) });
                }
            });
        })
            .catch((error) => {
            console.log(error);
        });
    }
    linkArray = removeDuplicates(linkArray);
    return linkArray;
};
exports.getRelatedArticles = getRelatedArticles;
const getArticleLink = (link, id) => {
    if (link.includes('http'))
        return link;
    const hashMap = {
        JO: "https://www.jamaicaobserver.com/",
        NW: "https://nationwideradiojm.com/",
        JL: "https://jamaica.loopnews.com/",
        JS: "http://jamaica-star.com/",
        RJ: "http://radiojamaicanewsonline.com/"
    };
    return link[0] != '/' ? hashMap[id] + link : hashMap[id].slice(0, -1) + link;
};
const includesText = (text) => {
    if (!text)
        return false;
    const keyWords = contextJson.keyWordsToInclude;
    for (let keyword of keyWords) {
        if (text.includes(keyword))
            return true;
    }
    return false;
};
const containsWordsToIgnore = (text) => {
    const excludedWords = contextJson.keyWordsToExclude;
    for (let excludedWord of excludedWords) {
        if (text.includes(excludedWord))
            return true;
    }
    return false;
};
const getArticleId = (url) => {
    if (url.includes("jamaicaobserver"))
        return "JO";
    if (url.includes("nationwideradiojm"))
        return "NW";
    if (url.includes("loopnews"))
        return "JL";
    if (url.includes("jamaica-star"))
        return "JS";
    if (url.includes("radiojamaicanewsonline"))
        return "RJ";
    return "ER";
};
const removeDuplicates = (linkArray) => {
    return [...new Map(linkArray.map(item => [item["text"], item])).values()];
};
//# sourceMappingURL=functions.js.map