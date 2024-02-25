import puppeteer from "puppeteer";
import express from "express";
import { expect } from "chai";
import { URL } from 'url';
const app = express();

// helper functions to start/stop server before/after tests
let server = null;
const startServer = () => {
    const __dirname = new URL('.', import.meta.url).pathname;
    app.use(express.static(__dirname + '/../../docs'));
    server = app.listen(8080);
};
const stopServer = () => {
    server.close();
};

// puppeteer options
const opts = {
    headless: true,
    timeout: 2000
};

// helper functions for pupeteer
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

describe('imagelightbox', function () {

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

    it('should show a caption', async function () {
        await page.click('.demo_caption li [src="images/thumb1.jpg"]');
        expect(await isElementVisible(page, '#imagelightbox')).to.equal(true);

        expect(await isElementVisible(page, '.imagelightbox-caption')).to.equal(true);

        const caption = await page.$(".imagelightbox-caption");
        expect(await (await caption.getProperty('textContent')).jsonValue()).to.equal('Sunset in Tanzania');
    });

    it('should be able to be triggered manually', async function () {
        await page.click('.trigger_lightbox');
        expect(await isElementVisible(page, '#imagelightbox')).to.equal(true);
    });

    it('should be controllable with arrows', async function () {
        await page.click('.demo_arrows li [src="images/thumb1.jpg"]');
        expect(await isElementVisible(page, '#imagelightbox')).to.equal(true);

        expect(await isElementVisible(page, '.imagelightbox-arrow-right')).to.equal(true);
        await page.click('.imagelightbox-arrow-right');

        expect(await isElementVisible(page, 'img[src$="images/demo2.jpg"]')).to.equal(true);
    });

    it('should add images dynamically', async function () {
        await page.click('.add_image');
        expect(await isElementVisible(page, '.demo_dynamic li [src="images/thumb4.jpg"]')).to.equal(true);

        await page.click('.demo_dynamic li [src="images/thumb4.jpg"]');
        expect(await isElementVisible(page, '#imagelightbox')).to.equal(true);

        expect(await isElementVisible(page, 'img[src$="images/demo4.jpg"]')).to.equal(true);
    });

    it('should go to deep links', async function () {
        await page.goto('http://localhost:8080?imageLightboxIndex=2',{ waitUntil: "load" });

        expect(await isElementVisible(page, '#imagelightbox')).to.equal(true);

        expect(await isElementVisible(page, 'img[src$="images/demo3.jpg"]')).to.equal(true);
    });

    /**
     * TODO fix that one by testing not only if the nav shows up but also if the nav works
     */
    it('should have a functionable navigation', async function () {
        await page.click('.demo_navigation li [src="images/thumb2.jpg"]');
        expect(await isElementVisible(page, '#imagelightbox')).to.equal(true);

        expect(await isElementVisible(page, '.imagelightbox-navitem')).to.equal(true);

        //await page.click('a.imagelightbox-navitem');
        //expect(await isElementVisible(page, 'img[src$="images/demo1.jpg"]')).to.equal(true);
    });
});
