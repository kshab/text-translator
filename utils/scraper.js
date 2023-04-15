const cheerio = require('cheerio');
const axios = require('axios');

class Scraper {
  #maxPromptLength = 1000;
  #paragraphSeparator = '\u000A';

  async getParagraphsToTranslate(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const foundElements = $('#main article .available-content p');
      const paragraphs = [];

      foundElements.each((i, p) => {
        paragraphs.push($(p).text());
      });

      return paragraphs;
    } catch (error) {
      console.error(error);
    }
  }

  async #getPromptBodies(paragraphs) {
    const promptBodies = [ '' ];
    let currentLength = 0;
    let currentIndex = 0;

    for (const str of paragraphs) {
      const newLength = currentLength + str.length;
      const isMoreThanLimit = newLength > this.#maxPromptLength;

      if (isMoreThanLimit) {
        currentIndex++;
        currentLength = 0;
        promptBodies[ currentIndex ] = '';
      }

      promptBodies[ currentIndex ] = promptBodies[ currentIndex ] + this.#paragraphSeparator + str;
      currentLength += str.length;
    }

    return promptBodies;
  }
}

module.exports = Scraper;
