module.exports = (function (settings) {
    if (process.platform === 'linux') {
        settings.selenium.cli_args['webdriver.chrome.driver'] = 'test/resources/chromedriver-2.43-linux';
    }
    else if (process.platform === 'darwin') {
        settings.selenium.cli_args['webdriver.chrome.driver'] = 'test/resources/chromedriver-2.43-macos';
    }
    else if (process.platform === 'win32') {
        settings.selenium.cli_args['webdriver.chrome.driver'] = 'test/resources/chromedriver-2.43.exe';
    }

    return settings;

})(require('./nightwatch.json'));
