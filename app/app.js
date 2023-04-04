(async (filename, options) => {
    const InoScrapper = require("./inoscapper.js");

    //start browser
    await InoScrapper.initialize();

    //get all articles on x pages
    if (InoScrapper.currentPage < InoScrapper.config.maxPages) {
        for (let i = 0; i < InoScrapper.config.maxPages; i++) {
            await InoScrapper.fetchPageArticles();
            await InoScrapper.nextPage();
        }
    }

    //filter articles with keywords
    InoScrapper.filteredArticles = InoScrapper.articles.filter(article => {
        return InoScrapper.config.keywords.some(keyword => article.title.toLowerCase().includes(keyword.toLowerCase()));
    });
    console.log(`Filtered ${InoScrapper.filteredArticles.length} articles out of ${InoScrapper.articles.length}`);

    //apply sentiment analysis
    InoScrapper.filteredArticles.forEach(article => {
        article.sentiment = InoScrapper.getSentimentArticle(article);
    });

    //output articles to csv file
    const fs = require('fs');
    const dir = './generated';
    let fileNumber = 0;
    for (const file of fs.readdirSync(dir)) {
        const basename = file.split('.')[0]
        if(basename === 'articles-' + fileNumber) {
            fileNumber++;
        }
    }

    const otc = require('objects-to-csv');
    const csv = new otc(InoScrapper.filteredArticles);
    await csv.toDisk(`./generated/articles-${fileNumber}.csv`)
    console.log("Generated CSV file");



    //stop browser
    await InoScrapper.stop();
})();
