const { expect } = require('chai');

const express = require('express');
const app = express();

// Some random port to use for testing
const PORT = 8080;

// Helper functions to start/stop app before/after tests
let server = null;
const startApp = () => {
    app.use(express.static(__dirname + '/../../docs'));
    server = app.listen(PORT);
};
const stopApp = () => {
    server.close();
};

describe('sample test', function () {
    let page;

    before (async function () {
        startApp();
        page = await browser.newPage();
        await page.goto('http://localhost:8080/');
    });

    after (async function () {
        await page.close();
        stopApp();
    });

    it('should have the correct page title', async function () {
        expect(await page.title()).to.eql('Imagelightbox');
    });

    it('should open and close the lightbox', async function () {
        await page.click('.demo_activity li [src="images/thumb1.jpg"]');

        await page.waitForSelector('#imagelightbox');

        const lightbox = await page.$('#imagelightbox');
        expect(lightbox).to.not.eql(null);

        const container = await page.$('#container');
        await container.click();

        //await page.waitForSelector('#imagelightbox');
    });

    /*
    'Caption' : function (browser) {
        openDemo(browser);
        browser.click('.demo_caption li [src="images/thumb1.jpg"]')
            .waitForElementVisible('#imagelightbox', 1000)
            .assert.elementPresent('#imagelightbox')
            .waitForElementVisible('.imagelightbox-caption', 1000)
            .assert.containsText('.imagelightbox-caption', 'Sunset in Tanzania');
        closeDemo(browser);
    },

    'Deep links' : function (browser) {
        openDemo(browser, '?imageLightboxIndex=2');
        browser
            .waitForElementVisible('#imagelightbox', 2000)
            .assert.elementPresent('#imagelightbox')
            .waitForElementVisible('img[src$="images/demo3.jpg"]', 1000)
            .assert.elementPresent('img[src$="images/demo3.jpg"]');
        closeDemo(browser);
    },

    'Dynamic add' : function (browser) {
        openDemo(browser);
        browser.click('.add_image')
            .click('.demo_dynamic li [src="images/thumb4.jpg"]')
            .waitForElementVisible('#imagelightbox', 1000)
            .assert.elementPresent('#imagelightbox')
            .waitForElementVisible('img[src$="images/demo4.jpg"]', 1000)
            .assert.elementPresent('img[src$="images/demo4.jpg"]')
            .click('.imagelightbox-arrow-right')
            .waitForElementVisible('img[src$="images/demo1.jpg"]', 1000)
            .assert.elementPresent('img[src$="images/demo1.jpg"]');
        closeDemo(browser);
    },

    'Manual trigger' : function (browser) {
        openDemo(browser);
        browser.click('.trigger_lightbox')
            .waitForElementVisible('#imagelightbox', 1000)
            .assert.elementPresent('#imagelightbox')
            .waitForElementVisible('.imagelightbox-arrow-right', 1000)
            .click('.imagelightbox-arrow-right')
            .waitForElementVisible('img[src$="images/demo2.jpg"]', 1000)
            .assert.elementPresent('img[src$="images/demo2.jpg"]');
        closeDemo(browser);
    },

    'Navigation' : function (browser) {
        openDemo(browser);
        browser
            .click('.demo_navigation li [src="images/thumb1.jpg"]')
            .waitForElementVisible('#imagelightbox', 1000)
            .assert.elementPresent('#imagelightbox')
            .assert.elementPresent('.imagelightbox-nav')
            .assert.elementPresent('.imagelightbox-navitem')
            .click('.imagelightbox-navitem:nth-child(2)')
            .waitForElementVisible('img[src$="images/demo2.jpg"]', 1000)
            .assert.elementPresent('img[src$="images/demo2.jpg"]');
        closeDemo(browser);
    }
    */
});
