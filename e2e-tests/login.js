module.exports = {
  '@tags': ['login'],
  login: function (browser) {
    browser
      .url('https://staging.ece-fawkes.ctoecskylight.com')
      .useXpath()
      .click("//*/a[contains(@href,'/login')]")
      .useCss()
      .waitForElementVisible('body')
      .assert.titleContains('IdentityServer4')
      .setValue('#Username', 'voldemort')
      .setValue('#Password', 'thechosenone')
      .useXpath()
      .click("//*/button[contains(@value,'login')]")
      .useCss()
      .waitForElementVisible('body')
      .assert.titleContains('Getting started')
      .end();
  },
};
