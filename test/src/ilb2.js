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
        browser.click('.add-image')
            .click('[src="images/thumb4.jpg"')
            .waitForElementVisible('#imagelightbox', 1000)
            .assert.elementPresent("#imagelightbox")
            .waitForElementVisible('img[src$="images/demo4.jpg"]', 1000)
            .assert.elementPresent('img[src$="images/demo4.jpg"]')
            .click('.imagelightbox-arrow-right')
            .waitForElementVisible('img[src$="images/demo1.jpg"]', 1000)
            .assert.elementPresent('img[src$="images/demo1.jpg"]')
            .end();
    },

    "Manual trigger" : function (browser) {
        openDemo(browser);
        browser.click('.trigger-lightbox')
            .waitForElementVisible('#imagelightbox', 1000)
            .assert.elementPresent("#imagelightbox")
            .click('.imagelightbox-arrow-right')
            .waitForElementVisible('img[src$="images/demo2.jpg"]', 1000)
            .assert.elementPresent('img[src$="images/demo2.jpg"]')
            .end();
    },

    "Navigation" : function (browser) {
        openDemo(browser);
        browser
            .click('.demo-navigation li [src="images/thumb1.jpg"')
            .waitForElementVisible('#imagelightbox', 1000)
            .assert.elementPresent("#imagelightbox")
            .assert.elementPresent("#imagelightbox-nav")
            .assert.elementPresent(".imagelightbox-navitem")
            .click('.imagelightbox-navitem:nth-child(2)')
            .waitForElementVisible('img[src$="images/demo2.jpg"]', 1000)
            .assert.elementPresent('img[src$="images/demo2.jpg"]')
            .end();
    }
};
