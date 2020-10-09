// nightwatchjs.org/gettingstarted/configuration/

https: nightwatch_config = {
  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80,
    // proxy: 'http://PROXY_USERNAME:PROXY_PASSWORD@proxy-host:proxy-port',
  },
  test_settings: {
    default: {
      desiredCapabilities: {
        'browserstack.user': 'julia518',
        'browserstack.key': 'Uq4nUNp12oP9oMoYquej',
        browser: 'chrome',
      },
    },
  },
};

// Code to copy seleniumhost/port into test settings
for (var i in nightwatch_config.test_settings) {
  var config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
}
module.exports = nightwatch_config;
