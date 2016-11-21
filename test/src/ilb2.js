module.exports = {

    "Open demo page" : function (browser) {
        browser
            .url("http://localhost:8080/docs/index.html")
            .waitForElementVisible('body', 1000)
            .end();
    }
};
