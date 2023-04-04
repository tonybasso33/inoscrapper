const puppeteer = require('puppeteer');

class InoScrapper {

    static browser = null;
    static page = null;
    static currentPage = 1;
    static articles = [];
    static filteredArticles = [];
    static config = null;

    static async initialize() {
        console.log("Initializing browser...");
        //get configuration
        InoScrapper.config = require('../inoconfig.json');

        //start browser
        InoScrapper.browser = await puppeteer.launch();
        InoScrapper.page = await InoScrapper.browser.newPage();
        await InoScrapper.page.goto(InoScrapper.config.url);
        await InoScrapper.page.waitForSelector('.article_magazine_title_link');

        //make console.log work in browser context
        this.page.on('console', msg => {
            for (let i = 0; i < msg.args().length; ++i)
                console.log(`${i}: ${msg.args()[i]}`);
        });
    }

    // fetch articles from the current inoreader page
    static async fetchPageArticles() {
        InoScrapper.log("Fetching articles of page", InoScrapper.currentPage, "out of", InoScrapper.config.maxPages);
        InoScrapper.articles.push(...await this.page.evaluate(() => {

            const articlesData = [];

            //article scrap
            const articleElements = document.querySelectorAll('.article_magazine_content_wraper');
            articleElements.forEach(articleElement => {
                const title = articleElement.querySelector('.article_magazine_title_link').textContent.trim();
                const link = articleElement.querySelector('.article_magazine_title_link').getAttribute('href').trim();
                const content = articleElement.querySelector('.article_magazine_content').textContent.trim();

                if (!articlesData.includes(link)) {
                    articlesData.push({title, link, content});
                }
            });

            return articlesData;
        }));
    }

    // get the sentiment of the content of an article
    static getSentimentArticle(article) {
        const Sentiment = require('sentiment');
        const sentiment = new Sentiment();
        const result = sentiment.analyze(article.content);
        let sentimentLevel = SentimentLevel.NEUTRAL;

        //translate score to enum
        if (result.score >= 4) {
            sentimentLevel = SentimentLevel.VERY_POSITIVE;
        }
        if (result.score >= 2) {
            sentimentLevel = SentimentLevel.POSITIVE;
        }
        if (result.score >= 0) {
            sentimentLevel = SentimentLevel.NEUTRAL;
        }
        if (result.score >= -2) {
            sentimentLevel = SentimentLevel.NEGATIVE;
        }
        if (result.score <= -4) {
            sentimentLevel = SentimentLevel.VERY_NEGATIVE;
        }

        return sentimentLevel;
    }

    // click on next page link
    static async nextPage() {
        InoScrapper.currentPage++;
        await InoScrapper.page.click('a[rel="nofollow"]');
    }

    // stop the browser
    static async stop() {
        console.log("Stopping browser");
        await InoScrapper.browser.close();
    }

    // log to console
    static log(text, number, of, number2) {
        let end = `\r`;
        if (number < 2) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
        } else if (number > InoScrapper.config.maxPages - 1) {
            end = '\n';
        }
        process.stdout.write(`${text} ${number} ${of} ${number2}...${end}`);
    }
}

//an enum that has different level of sentiment
const SentimentLevel = {
    VERY_POSITIVE:"VERY_POSITIVE",
    POSITIVE:"POSITIVE",
    NEUTRAL:"NEUTRAL",
    NEGATIVE:"NEGATIVE",
    VERY_NEGATIVE:"VERY_NEGATIVE"
}

module.exports = SentimentLevel;
module.exports = InoScrapper;
