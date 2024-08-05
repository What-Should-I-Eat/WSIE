const express = require('express');
const scrapeRouter = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

scrapeRouter.get('/scrape-recipe', async (req, res) => {
  const recipeLink = req.query.recipeLink;
  const recipeName = req.query.recipeName;

  try {
    const data = await getRecipeDirectionsFromSource(recipeLink, recipeName);
    console.log("SCRAPED DATA: " + data);
    res.json(data);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'Failed to scrape data, please check the provided URL and source.' });
  }
});

async function getRecipeDirectionsFromSource(link, recipeName) {
  console.log(`Made it to get data. Link = ${link}`);

  try {
    const response = await axios.get(link);
    const html = response.data;
    const $ = cheerio.load(html);
    const directionsScrape = '*:not(script,style,noscript,figcaption)';
    const recipeDirections = [];
    var startScrapingDirections = false;
    var firstElementRead = false;
    var stopScraping = false;
    var classNameOfElement = '';
    var firstInstructionElement = '';
    const keyTerms = ['recipe from', 'you rate', 'originally posted at'];

    $(directionsScrape).each((_, element) => {
      if (!stopScraping) {
        var htmlObjectContents = ($(element).contents().filter(function () {
          return this.type === 'text';
        }).text().trim());
        if (htmlObjectContents.length === 0 || htmlObjectContents.length === undefined) {
        } else {
          if (startScrapingDirections) {
            classNameOfElement = $(element).get(0).tagName;
            var elementResult = classNameOfElement.localeCompare(firstInstructionElement);
            htmlObjectContentsLower = htmlObjectContents.toLowerCase();
            var resultReview = htmlObjectContentsLower.indexOf("reviews");
            var commentsReview = htmlObjectContentsLower.indexOf("comments");
            if ((firstElementRead && (elementResult != 0) && (htmlObjectContents.length > 40)) || (resultReview >= 0) || (commentsReview >= 0)) {
              stopScraping = true;
            } else {
              console.log("contents: " + htmlObjectContentsLower);
              if (htmlObjectContents.length > 40 && !(keyTerms.some(term => htmlObjectContentsLower.includes(term)))) {
                if (!firstElementRead) {
                  firstElementRead = true;
                  firstInstructionElement = classNameOfElement;
                }
                recipeDirections.push(htmlObjectContents);
              }
            }
          }

          if (!startScrapingDirections) {
            htmlObjectContentsLower = htmlObjectContents.toLowerCase()
            var result = htmlObjectContentsLower.localeCompare("directions");
            if (result === 0) {
              console.log('found directions and will start scraping');
              startScrapingDirections = true;
            }
            result = htmlObjectContentsLower.localeCompare("instructions");
            if (result === 0) {
              console.log('found instructions and will start scraping');
              startScrapingDirections = true;
            }
            result = htmlObjectContentsLower.localeCompare("method");
            if (result === 0) {
              console.log('found method and will start scraping');
              startScrapingDirections = true;
            }
            result = htmlObjectContentsLower.localeCompare("preparation");
            if (result === 0) {
              console.log('found method and will start scraping');
              startScrapingDirections = true;
            }
          }
        }
      }
    });

    return recipeDirections;
  } catch (error) {
    console.error(`Error in scraping recipe directions: ${error}`);
    throw error;
  }
}

module.exports = scrapeRouter;