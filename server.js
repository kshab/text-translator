const express = require('express');
const Scraper = require("./utils/scraper");
const Translator = require("./utils/translator");

const PORT = process.env.port || 8000;
const API_KEY = process.env.OPENAI_API_KEY;

const app = express();

app.get('/', async (req, res) => {
  const url = 'https://medium.com/@x_TomCooper_x/ukraine-war-15-march-2023-standstill-8746dc3160d';
  const scraper = new Scraper();
  const paragraphsToTranslate = await scraper.getParagraphsToTranslate(url);

  const translator = new Translator(API_KEY);
  const testParagraphs = paragraphsToTranslate.slice(0, 5);
  const translation = await translator.getTranslation(testParagraphs);

  res.send({ translation });
});

app.listen(PORT, () => console.log(`Server is runnint on port: ${PORT}`));
