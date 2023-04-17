const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Scraper = require("./utils/scraper");
const Translator = require("./utils/translator");
const { saveResult, createFile, getFileContent, existsSync } = require("./utils/fs");

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 3000;


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const translateAndSaveParagraphs = async (paragraphs, translator, filePath) => {
  const translatedParagraphs = [];
  let count = 0;

  for (const p of paragraphs) {
    const response = await translator.getTranslation(p);
    const trimmedTranslatedParagraph = response.replace('\n\n', '\u00a0');

    translatedParagraphs.push(trimmedTranslatedParagraph);

    console.timeLog('Translation');
    console.log('Translation ', ++count);

    saveResult(trimmedTranslatedParagraph, filePath);
  }
};

const runTranslation = async (url, filePath, paragraphs = []) => {
  const translator = new Translator(API_KEY);
  let paragraphsToTranslate = [];

  if (!paragraphs.length) {
    const scraper = new Scraper();
    paragraphsToTranslate = await scraper.getParagraphsToTranslate(url);
  } else {
    paragraphsToTranslate = paragraphs;
  }

  translateAndSaveParagraphs(paragraphsToTranslate, translator, filePath);
};

app.get('/', async (req, res) => {
  const response = 'Hello!';
  res.send(response);
});

app.get('/translation', async (req, res) => {

  if (!existsSync()) {
    res.json('No translation found');
    return;
  }

  const translation = getFileContent('translation.json');

  res.json(JSON.parse(translation));
});

app.post('/', async (req, res) => {
  res.end('Got you!')
  const filePath = 'translation.json';
  const url = req.body.url || '';
  const paragraphsToTranslate = req.body.data;

  createFile(filePath);

  console.time('Translation');
  console.log('Translation start');

  await runTranslation(url, filePath, paragraphsToTranslate);

  console.timeEnd('Translation');
  console.log('Translation end');
});

app.listen(PORT, () => console.log(`Server is runnint on port: ${PORT}`));
