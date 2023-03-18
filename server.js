const express = require('express');
const Scraper = require("./utils/scraper");

const PORT = process.env.port || 3000;

const app = express();

app.get('/', async (req, res) => {
  const url = 'https://medium.com/@x_TomCooper_x/ukraine-war-15-march-2023-standstill-8746dc3160d';
  const scraper = new Scraper();
  const paragraphsToTranslate = await scraper.getParagraphsToTranslate(url);

  const translation = await [paragraphsToTranslate[0], paragraphsToTranslate[2]];

  res.send({ translation });
});

app.listen(PORT, () => console.log(`Server is runnint on port: ${PORT}`));
