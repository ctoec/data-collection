const { FakeChildrenTypes } = require('../utils/FakeChildrenTypes');
const { login } = require('../utils/login');
const { uploadFile } = require('../utils/uploadFile');
const { UploadFileTypes } = require('../utils/UploadFileTypes');
const { clearDb } = require('../utils/clearDb');

module.exports = {

  before(browser) {
    clearDb();
  },

  '@tags': ['upload'],
  uploadMissingOne: async function (browser) {
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    await login(browser);
    const filetypes = Object.values(UploadFileTypes);
    for (let i = 0; i < filetypes.length; i++) {
      const filetype = filetypes[i];
      await uploadFile(
        browser,
        filetype,
        FakeChildrenTypes.MISSING_ONE,
        i === 0
      );
    }
    browser.end();
  },
};
