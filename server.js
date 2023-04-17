const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Scraper = require("./utils/scraper");
const Translator = require("./utils/translator");
const { saveResult, createFile, getFileContent } = require("./utils/fs");

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 3000;


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const translateAndSaveParagraph = async (paragraph, translator, filePath) => {
  const translatedParagraphs = [];
  const response = await translator.getTranslation(paragraph);
  const trimmedTranslatedParagraph = response.replace('\n\n', '\u00a0');

  let count = 0;

  translatedParagraphs.push(trimmedTranslatedParagraph);

  console.timeLog('Translation');
  console.log('Translation ', ++count);

  saveResult(trimmedTranslatedParagraph, filePath);
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

  for (const p of paragraphsToTranslate) {
    translateAndSaveParagraph(p, translator, filePath)
  }
};

app.get('/', async (req, res) => {
  const response = 'Hello!';
  res.send(response);
});

app.get('/translation', async (req, res) => {
  const translation = getFileContent('translation.json');

  if (!translation) {
    res.json('Not found');
    return;
  }

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
