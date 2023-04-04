const express = require('express');
const InoScrapper = require("./inoscapper");
const bodyParser = require("express");
const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// form page route
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname+'/web/index.html'));
});

// post form route
app.post('/', async (req, res) => {
    const { url, keywords, maxPages } = req.body;

    // initialize InoScrapper
    await InoScrapper.initialize(url, keywords, maxPages);

    // scrape articles from Inoreader
    await InoScrapper.scrape();

    // generate CSV
    await InoScrapper.generateCsv();

    //send csv
    res.header('Content-Type', 'text/csv');
    res.download(InoScrapper.lastestGeneratedCsvPath);
});


// Start server
const port = 3000;
app.listen(3000, () => {
    console.log(`Server started on port ${port}`);
});
