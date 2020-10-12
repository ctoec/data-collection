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
        browserName: 'edge',
      },
    },
    ie: {
      desiredCapabilities: {
        browserName: 'internet explorer',
      },
    },
  },
};

// Code to copy seleniumhost/port into test settings
for (var i in nightwatch_config.test_settings) {
  var config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
  config.desiredCapabilities['browserstack.user'] = process.env.BROWSERSTACK_USER;
  config.desiredCapabilities['browserstack.key'] = process.env.BROWSERSTACK_KEY;
}
module.exports = nightwatch_config;