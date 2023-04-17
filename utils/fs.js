
const { writeFile, readFile, writeFileSync, readFileSync, existsSync } = require('fs');

const saveResult = async (translation, filePath) => {
  readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
    }

    const newData = {
      translation: ''
    };

    const newText = translation || '';

    if (!data) {
      newData.translation = newText.replaceAll('\n\n', '');
    } else {
      newData.translation = JSON.parse(data).translation + newText.replaceAll('\n\n', '');
    }

    writeFile(filePath, JSON.stringify(newData), err => console.error(err));
  });
};

const createFile = (path) => {
  writeFileSync(path, JSON.stringify({ translation: '' }));
};

const getFileContent = (filePath) => {
  return readFileSync(filePath);
};

module.exports = { saveResult, createFile, getFileContent, existsSync };