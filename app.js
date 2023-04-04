
(async () => {
    const InoScrapper = require("./inoscapper.js");
    const config = require("./inoconfig-sample.json");

    //start browser
    await InoScrapper.initialize();

    //get all articles on x pages
    let currentPage = 1;
    if(currentPage < config.maxPages) {
        for(let i = 0; i < config.maxPages; i++) {
            await InoScrapper.fetchPageArticles();
            await InoScrapper.nextPage();
            currentPage++;
        }
    }

    //filter articles with keywords
    InoScrapper.articles = InoScrapper.articles.filter(article => {
        return config.keywords.some(keyword => {
            return article.title.toLowerCase().includes(keyword.toLowerCase());
        });
    });

    //log articles to console
    InoScrapper.logArticles();

    //stop browser
    await InoScrapper.stop();
})();


