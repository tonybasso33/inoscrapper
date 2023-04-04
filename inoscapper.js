const puppeteer = require('puppeteer');

class InoScrapper {

    static browser = null;
    static page = null;
    static articles = [];

    static async initialize() {
        //get configuration
        const config = require('./inoconfig-sample.json');

        //start browser
        InoScrapper.browser = await puppeteer.launch();
        InoScrapper.page = await InoScrapper.browser.newPage();
        await InoScrapper.page.goto(config.url);
        await InoScrapper.page.waitForSelector('.article_magazine_title_link');

        //make console.log work in browser context
        this.page.on('console', msg => {
            for (let i = 0; i < msg.args().length; ++i)
                console.log(`${i}: ${msg.args()[i]}`);
        });
    }

    // fetch articles from the current inoreader page
    static async fetchPageArticles() {
        InoScrapper.articles.push(...await this.page.evaluate(() => {
            const articlesData = [];

            //article scrap
            const articleElements = document.querySelectorAll('.article_magazine_content_wraper');
            articleElements.forEach(articleElement => {
                const title = articleElement.querySelector('.article_magazine_title_link').textContent.trim();
                const link = articleElement.querySelector('.article_magazine_title_link').getAttribute('href').trim();
                const content = articleElement.querySelector('.article_magazine_content').textContent.trim();

                if(!articlesData.includes(link)){
                    articlesData.push({title,link,content});
                }

            });

            return articlesData;
        }));
    }

    // click on next page link
    static async nextPage() {
        await InoScrapper.page.click('a[rel="nofollow"]');
    }

    // stop the browser
    static async stop() {
        await InoScrapper.browser.close();
    }

    //pretty log articles
    static logArticles() {
        console.log(`---------------------------------------------------------------------------------------`);
        console.log(`------------------------------------------[${InoScrapper.articles.length}]------------------------------------------`);
        console.log(`---------------------------------------------------------------------------------------`);
        for (let i = 0; i < InoScrapper.articles.length; i++) {
            const article = InoScrapper.articles[i];
            console.log(`[${i}]--------------------------------------------`);
            //add i before the title
            console.log(article.title);
            console.log(article.link);
            console.log(article.content);
        }
    }
}

module.exports = InoScrapper;
