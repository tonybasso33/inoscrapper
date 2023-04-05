# InoScrapper
InoScrapper is a tool that allows you to retrieve article links from Inoreader based on criteria such as keywords, dates, websites, etc. It uses Puppeteer and Node.js to access Inoreader's content and extract data of corresponding articles.

## Installation
Clone this Git repository on your computer using the following command:
```bash
git clone https://github.com/tonybasso33/inoscrapper.git
```

Then, install dependencies using npm:
```bash
npm install
```
## Configuration
Before using InoScrapper, you need to configure the Inoreader access settings in the config.json file. Here is an example configuration file:
```json
{
    "url": "https://www.inoreader.com/xxxx/xxxxxxx/xxxxx",
    "keywords": ["keyword1", "keyword2"],
    "maxPages": "your-password",
    "useWeb": "true"
}
```

## Usage
To use InoScrapper, run the following command:
```bash
npm start
```
This will launch the app, which will open a web page. 
You can then specify the search criteria for the article links and retrieve the links of corresponding articles.
