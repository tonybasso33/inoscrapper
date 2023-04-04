import puppeteer from 'puppeteer';
import {load} from 'cheerio';

const filter = 'keyword';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(`https://www.inoreader.com/stream/user/1004995301/tag/dddd/view/html?cs=m`);

const articles = await page.evaluate(() => {
    document.querySelectorAll('.article_magazine_content_wraper').forEach(articleHtml => {
        let arr = [];
        const article = new Article(articleHtml);
        arr.push(article);
        if (article.content.indexOf(filter) > -1) {
            console.log("--------------------");
            console.log(article.title);
            console.log(article.link);
            console.log(article.content);
        }
        return arr;
    });
});

for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (article.content.indexOf(filter) > -1) {
        console.log("--------------------");
        console.log(article.title);
        console.log(article.link);
        console.log(article.content);
    }
}

await browser.close();


class Article {
    constructor(html) {
        const $ = load(html);
        this.title = $('.article_magazine_title').text();
        this.link = $('.article_magazine_title_link').attr('href');
        this.content = $('.article_magazine_content').text();
    }
}
