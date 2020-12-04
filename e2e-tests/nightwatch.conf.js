// nightwatchjs.org/gettingstarted/configuration/

https: nightwatch_config = {
  src_folders: ['./tests'],
  custom_commands_path: ['./customCommands'],
  disable_error_log: true,
  live_output: false,
  output: false,
  detailed_output: false,
  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 443,
    silent: true,
    disable_error_log: true,
  },
  // TODO: make it possible to pass an arg or have an environment variable or something
  // So that we actually test PRs and not just staging
  launch_url: 'https://staging.ece-fawkes.ctoecskylight.com',
  test_settings: {
    default: {
      globals: {
        waitForConditionTimeout: 5000, // sometimes internet is slow so wait.
      },
      desiredCapabilities: {
        browserName: 'chrome',
      },
    },
    edge: {
      desiredCapabilities: {
        browserName: 'edge',
      },
    },
    ie: {
      // TODO: make app work in ie and add ie to test command in package json
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
