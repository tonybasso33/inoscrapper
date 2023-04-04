# InoScrapper
InoScrapper is a simple web scrapper that scrapes the latest news from a given Inoreader feed and saves it to a file.

## Usage
Remove `inoconfig-sample.json` to `inoconfig.json`, and change these keys in to configure the script:
- `url` - The url of the feed
- `keywords` - The keywords to search for in the feed
- `maxPages` - The maximum number of pages to navigate through

Then run launch the command
```bash
node app.js
```
The script will create a file called `articles.csv` in the same directory as the script with the filtered articles.
