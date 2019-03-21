const puppeteer = require('puppeteer');
const express = require('express');
const expect = require('chai').expect;
const app = express();

// Helper functions to start/stop server before/after tests
let server = null;
const startServer = () => {
    app.use(express.static(__dirname + '/../../docs'));
    server = app.listen(8080);
};
const stopServer = () => {
    server.close();
};

// puppeteer options
const opts = {
    headless: false,
    timeout: 2000,
    args: ['--no-sandbox']
};

const isElementVisible = async (page, cssSelector) => {
    let visible = true;
    await page.waitForSelector(cssSelector, { visible: true })
        .catch(() => {
            visible = false;
        });
    return visible;
};

const isElementNotVisible = async (page, cssSelector) => {
    let visible = false;
    await page.waitForSelector(cssSelector, { visible: false })
        .catch(() => {
            visible = true;
        });
    return visible;
};

describe('sample test', function () {

    // Define global variables
    let browser;
    let page;

    before(async function () {
        startServer();
        browser = await puppeteer.launch(opts);
        page = await browser.newPage();
    });

    beforeEach(async function () {
        page = await browser.newPage();
        await page.goto('http://localhost:8080',{ waitUntil: "load" });
    });

    afterEach(async function () {
        await page.close();
    });

    after(async function () {
        await browser.close();
        stopServer();
    });

    it('should have the correct page title', async function () {
        expect(await page.title()).to.eql('Imagelightbox');
    });

    it('should open and close the lightbox', async function () {
        await page.click('.demo_activity li [src="images/thumb1.jpg"]');
        expect(await isElementVisible(page, '#imagelightbox')).to.equal(true);

        await page.click('#container');
        expect(await isElementNotVisible(page, '#imagelightbox')).to.equal(false);
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
