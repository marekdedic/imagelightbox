var seleniumServer = require('selenium-server');
var chromedriver = require('chromedriver');

module.exports = (function (settings) {
    settings.selenium.server_path = seleniumServer.path;
    settings.selenium.cli_args['webdriver.chrome.driver'] = chromedriver.path;
    return settings;

})(require('./nightwatch.json'));
