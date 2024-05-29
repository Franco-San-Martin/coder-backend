const fs = require('fs');

const readDataFromFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const writeDataToFile = (filePath, data) => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData);
};

module.exports = {
    readDataFromFile,
    writeDataToFile,
};