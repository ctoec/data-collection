module.exports = {
  '@tags': ['smoke-test'],
  'smoke-test': function (browser) {
    browser
      .url('https://staging.ece-fawkes.ctoecskylight.com')
      .waitForElementVisible('body')
      .assert.titleContains('Upload your enrollment data')
      .end();
  },
};
