function openDemo (browser) {
    browser.url("http://localhost:8080/docs/index.html")
}

module.exports = {

    "Open demo page" : function (browser) {
        openDemo(browser);
        browser.assert.elementPresent("#main_content")
            .end();
    },

    "Open lightbox page" : function (browser) {
        openDemo(browser);
        browser.click('.options_activity li a')
            .waitForElementVisible('#imagelightbox', 1000)
            .assert.elementPresent("#imagelightbox")
            //.assert.containsText('ol#rso li:first-child', 'Rembrandt - Wikipedia')
            .end();
    },

    "Dynamic add" : function (browser) {
        openDemo(browser);
        browser.click('#addimage')
            .click('[src="images/thumb4.jpg"')
            .waitForElementVisible('#imagelightbox', 1000)
            .assert.elementPresent("#imagelightbox")
            .assert.elementPresent('img[src$="images/demo4.jpg"]')
            .end();
    },

    "Manual trigger" : function (browser) {
        openDemo(browser);
        browser.click('.trigger-button')
            .waitForElementVisible('#imagelightbox', 1000)
            .assert.elementPresent("#imagelightbox")
            .end();
    }
};
