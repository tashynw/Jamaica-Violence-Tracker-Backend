import { AxiosError, AxiosResponse } from "axios";
import { ArticleInformationType, CrawlLink } from "../types/types";
var cheerio = require("cheerio");
const axios = require("axios").default;
const contextJson = require("../context.json");
const { Articles } = require("../models/Articles");

export async function updateArticleResults() {
  try {
    const fetchedArticles = await getRelatedArticles();
    
    await Articles.deleteMany({});
    await Articles.create(fetchedArticles);
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

const getRelatedArticles = async (): Promise<ArticleInformationType[]> => {
  const urls: CrawlLink[] = contextJson.websitesToCrawl;
  let linkArray: ArticleInformationType[] = [];

  for (const url of urls) {
    await axios
      .get(url.link)
      .then((response: AxiosResponse) => {
        let $ = cheerio.load(response.data);
        let links = $("a");
        $(links).each((i: number, link: any) => {
          if (
            includesText($(link).text()) &&
            !containsWordsToIgnore($(link).text())
          ) {
            linkArray.push({
              key: url.key,
              text: $(link).text().trim(),
              link: getArticleLink($(link).attr("href"), url.key),
              countryCode: url.countryCode,
            });
          }
        });
      })
      .catch((error: AxiosError | Error) => {
        console.error(error);
      });
  }
  linkArray = removeDuplicates(linkArray);
  console.log(`📰 ${linkArray.length} articles fetched`);
  return linkArray;
};

const getArticleLink = (link: string, id: string): string => {
  if (link.includes("http")) return link;
  const hashMap: { [id: string]: string } = {
    JO: "https://www.jamaicaobserver.com/",
    NW: "https://nationwideradiojm.com/",
    JL: "https://jamaica.loopnews.com/",
    JS: "http://jamaica-star.com/",
    RJ: "http://radiojamaicanewsonline.com/",
    TTL: "https://tt.loopnews.com/",
    TTE: "https://trinidadexpress.com/",
    NTT: "https://newsday.co.tt/",
    NRG: "https://newsroom.gy/",
    ING: "https://www.inewsguyana.com/",
    DMW: "https://demerarawaves.com/",
    BBT: "https://barbadostoday.bb/",
    BBL: "https://barbados.loopnews.com/",
    NNB: "https://www.nationnews.com/",
    SLS: "https://stluciastar.com/",
    SLT: "https://stluciatimes.com/",
    SLL: "https://stlucia.loopnews.com/",
    CFB: "https://edition.channel5belize.com/",
    TBH: "http://www.tribune242.com/",
    BHP: "https://www.bahamaspress.com/",
    CVM: "https://www.cvmtv.com/"
  };
  return link[0] != "/" ? hashMap[id] + link : hashMap[id].slice(0, -1) + link;
};

const includesText = (text: string): boolean => {
  if (!text) return false;

  const keyWords: string[] = contextJson.keyWordsToInclude;
  for (let keyword of keyWords) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) return true;
  }
  return false;
};

const containsWordsToIgnore = (text: string): boolean => {
  const excludedWords: string[] = contextJson.keyWordsToExclude;
  for (let excludedWord of excludedWords) {
    if (text.toLowerCase().includes(excludedWord.toLowerCase())) return true;
  }
  return false;
};

const removeDuplicates = (
  linkArray: ArticleInformationType[]
): ArticleInformationType[] => {
  return [...new Map(linkArray.map((item) => [item["text"], item])).values()];
};

export { getRelatedArticles };
