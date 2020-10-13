// nightwatchjs.org/gettingstarted/configuration/

https: nightwatch_config = {
  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80,
  },
  test_settings: {
    default: {
      desiredCapabilities: {
        // ADD TO CI
        'browserstack.user': process.env.BROWSERSTACK_USER,
        'browserstack.key': process.env.BROWSERSTACK_KEY,
        browserName: 'edge',
      },
    },
    ie: {
      desiredCapabilities: {
        // ADD TO CI
        'browserstack.user': process.env.BROWSERSTACK_USER,
        'browserstack.key': process.env.BROWSERSTACK_KEY,
        browserName: 'internet explorer',
      },
    },
  },
};

// Code to copy seleniumhost/port into test settings
// We're only using one desired capability for now but we will be using more later
for (var i in nightwatch_config.test_settings) {
  var config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
}
module.exports = nightwatch_config;
