const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Scraper = require("./utils/scraper");
const Translator = require("./utils/translator");

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const runTranslation = async (url) => {
  const scraper = new Scraper();
  const paragraphsToTranslate = await scraper.getParagraphsToTranslate(url);

  const translator = new Translator(API_KEY);
  const testParagraphs = paragraphsToTranslate.slice(0, 2);
  const translation = await translator.getTranslation(testParagraphs);

  console.log(translation);
};

app.get('/', async (req, res) => {
  const url = 'https://medium.com/@x_TomCooper_x/ukraine-war-15-march-2023-standstill-8746dc3160d';
  const scraper = new Scraper();
  const paragraphsToTranslate = await scraper.getParagraphsToTranslate(url);

  const translator = new Translator(API_KEY);
  const testParagraphs = paragraphsToTranslate.slice(0, 2);
  const translation = await translator.getTranslation(testParagraphs);

  res.send({ translation });
});

app.post('/', async (req, res) => {
  res.end('Got you!')
  const url = req.body.url;
  runTranslation(url);
});

app.listen(PORT, () => console.log(`Server is runnint on port: ${PORT}`));
