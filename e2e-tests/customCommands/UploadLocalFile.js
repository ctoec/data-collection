const AdmZip = require('adm-zip');

// Taken directly from https://github.com/RohanImmanuel/NightwatchJS-Remote-File-Upload
module.exports = class UploadLocalFile {
  async command(filePath, inputSelector) {
    // Get Local File
    var zip = new AdmZip();
    zip.addLocalFile(filePath);
    var file = zip.toBuffer().toString('base64');

    // Upload file to remote terminal
    try {
      var returnValue = await this.httpRequest({
        path: '/session/:sessionId/file',
        sessionId: this.api.sessionId,
        data: { file },
        method: 'POST',
      });
    } catch (err) {
      console.error('An error occurred uploading file', err);
      return {
        status: -1,
        error: err.message,
      };
    }

    // Save path of file on remote terminal
    var tempFilePath = returnValue.value;

    // Get file input element
    try {
      var returnValue = await this.httpRequest({
        path: '/session/:sessionId/element',
        sessionId: this.api.sessionId,
        data: {
          using: 'css selector',
          value: inputSelector,
        },
        method: 'POST',
      });
    } catch (err) {
      console.error('An error occurred', err);
      return {
        status: -1,
        error: err.message,
      };
    }

    // Update file input with file path
    try {
      var returnValue = await this.httpRequest({
        path:
          '/session/:sessionId/element/' + returnValue.value.ELEMENT + '/value',
        sessionId: this.api.sessionId,
        data: {
          value: tempFilePath.split(''),
        },
        method: 'POST',
      });
    } catch (err) {
      console.error('An error occurred', err);
      return {
        status: -1,
        error: err.message,
      };
    }

    // Return response
    return returnValue;
  }
};
