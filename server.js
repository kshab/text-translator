const express = require('express');

const PORT = process.env.port || 3000;

const app = express();

app.get('/', async (req, res) => {
  const translation = await 'Some random text 123';

  res.send({ translation });
});

app.listen(PORT, () => console.log(`Server is runnint on port: ${PORT}`));
