const puppeteer  = require('puppeteer');

const Handler = async (req, h) => {
    try {     
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();

        // Navigate the page to a URL
        await page.goto('https://developer.chrome.com/');

        // Set screen size
        await page.setViewport({width: 1080, height: 1024});

        // Type into search box
        await page.type('.devsite-search-field', 'automate beyond recorder');

        // // Wait and click on first result
        await page.locator('.devsite-result-item-link').click();
        // const searchResultSelector = '.devsite-result-item-link';
        // await page.waitForSelector(searchResultSelector);
        // await page.click(searchResultSelector);

        // // Locate the full title with a unique string
        const textSelector = await page
        .locator('text/Customize and')
        .waitHandle();
        const fullTitle = await textSelector?.evaluate(el => el.textContent);
        // Print the full title
        console.log('The title of this blog post is "%s".', fullTitle);
        
        // Close the browser instance
        // await browser.close();
        return h.response({message:"Server is up and running..."}).code(200);
    } catch (error) {
        return h.response({message:error.message}).code(404);
    }
}


module.exports = {
    Handler
}