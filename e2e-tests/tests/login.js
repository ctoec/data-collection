const { login } = require('../utils/login');

module.exports = {
  '@tags': ['login'],
  login: async function (browser) {
    // Initializes with the launch_url value set in config
    await browser.init();
    await login(browser, false);
    browser.end();
  },
};
