const fs = require('fs');
const https = require('https');

module.exports = {
  downloadFileToTestRunnerHost: async function (path, url) {
    const stream = fs.createWriteStream(path);
    return https.get(url, function (response) {
      response.pipe(stream);
    });
  },
};
