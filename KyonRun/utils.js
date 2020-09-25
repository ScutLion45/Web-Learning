const fs = require('fs');

const wait = async (delay = 5000) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};

const writeScript = (path, content) => {
  fs.writeFileSync(path, content);
};

module.exports = {
  wait,
  writeScript,
};
