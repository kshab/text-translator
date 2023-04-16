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

const runTranslation = async (url, filePath, paragraphs) => {
  let paragraphsToTranslate = [];

  if (!paragraphs) {
    const scraper = new Scraper();
    paragraphsToTranslate = await scraper.getParagraphsToTranslate(url);
  } else {
    paragraphsToTranslate = paragraphs;
  }

  console.log('paragraphsToTranslate ', paragraphsToTranslate.length);

  const translator = new Translator(API_KEY);

  const translatedParagraphs = [];

  let count = 0;

  for (const p of paragraphsToTranslate) {
    const response = await translator.getTranslation(p);
    translatedParagraphs.push(response);

    console.timeLog('Translation');
    console.log('Translation ', ++count);

    saveResult(response, filePath);
  }
};

app.get('/', async (req, res) => {
  const response = 'Hello!';
  res.send(response);
});

app.get('/translation', async (req, res) => {
  const translation = getFileContent('translation.json');
  res.json(JSON.parse(translation));
});

app.post('/', async (req, res) => {
  res.end('Got you!')

  if (req.body.data) {
    console.log(req.body.data);
    console.log(typeof req.body.data);
    const paragraphsToTranslate = JSON.parse(req.body.data);
    console.log( paragraphsToTranslate );
    console.log( paragraphsToTranslate.length );

    // await runTranslation(url, filePath);
    return;
  }

  console.time('Translation');
  console.log('Translation start');

  const url = req.body.url;
  const filePath = 'translation.json';

  createFile(filePath);

  await runTranslation(url, filePath);

  console.timeEnd('Translation');
  console.log('Translation end');
});

app.listen(PORT, () => console.log(`Server is runnint on port: ${PORT}`));
