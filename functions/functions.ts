import { AxiosError, AxiosResponse } from "axios";
import { ArticleInformationType } from "../types/types";
var cheerio = require('cheerio');
const axios = require('axios').default;
const contextJson = require('../context.json');

const getRelatedArticles = async(): Promise<ArticleInformationType[]> => {
	const urls: string[] = contextJson.websitesToCrawl;
	let linkArray: ArticleInformationType[]=[];
	for(let url of urls){
		await axios.get(url)
			.then((response: AxiosResponse)=>{
				let $ = cheerio.load(response.data);
				let links = $('a');
				$(links).each((i: number, link: any)=>{
					if(includesText($(link).text()) && !containsWordsToIgnore($(link).text())){
						linkArray.push({id:getArticleId(url),text:$(link).text().trim(),link:getArticleLink($(link).attr('href'),getArticleId(url))})
					}
				});
			})
			.catch((error: AxiosError | Error)=>{
				console.log(error)
			})
	}
	linkArray = removeDuplicates(linkArray)
	return linkArray
}

const getArticleLink = (link:string,id: string) :string => {
	if(link.includes('http')) return link
	const hashMap: {[id:string]: string} = {
		JO: "https://www.jamaicaobserver.com/",
		NW: "https://nationwideradiojm.com/",
		JL: "https://jamaica.loopnews.com/",
		JS: "http://jamaica-star.com/",
		RJ: "http://radiojamaicanewsonline.com/"
	}
	return link[0]!='/' ? hashMap[id] + link : hashMap[id].slice(0, -1) + link;
}

const includesText = (text: string): boolean => {
	if(!text) return false
	const keyWords: string[] = contextJson.keyWordsToInclude;
	for(let keyword of keyWords){
		if(text.includes(keyword)) return true
	}
	return false;
}

const containsWordsToIgnore = (text: string): boolean => {
	const excludedWords: string[] = contextJson.keyWordsToExclude;
	for(let excludedWord of excludedWords){
		if(text.includes(excludedWord)) return true
	}
	return false
}

const getArticleId = (url: string): string=>{
	if (url.includes("jamaicaobserver")) return "JO"
	if (url.includes("nationwideradiojm")) return "NW"
	if (url.includes("loopnews")) return "JL"
	if (url.includes("jamaica-star")) return "JS"
	if (url.includes("radiojamaicanewsonline")) return "RJ"
	return "ER"
}

const removeDuplicates = (linkArray: ArticleInformationType[]): ArticleInformationType[] => {
	return [...new Map(linkArray.map(item => [item["text"], item])).values()]
}

export {
    getRelatedArticles
}
