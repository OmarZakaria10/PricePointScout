const puppeteer = require("puppeteer");
const { getBrowser } = require("./browserInstance");
async function scrapeCompuMart(keyword) {
    const products = [];

    const browser = await getBrowser();
    const page = await browser.newPage();
    
        const path = `https://www.compumarts.com/search?q=${encodeURIComponent(
            keyword)}&options%5Bprefix%5D=last&type=product&id=43620113121429&quantity=1`;
        await page.goto(path);
        
        const productsHandles = await page.$$(
            "#main-collection-product-grid"
        );

        for (const producthandle of productsHandles) {
            let title = "Null";
            let price = "Null";
            let link = "Null";
            let img = "Null";

            try {
                title = await page.evaluate(
                    (el) => el.querySelector("div > div > div.card-information > div.card-information__wrapper.text-center > h3")?.textContent.trim() || "Null",
                    producthandle
                );
            } catch (error) { }
            console.log(title);

            // try {
            //     price = await page.evaluate(
            //         (el) =>
            //             el.querySelector(".info > .prc")?.textContent.trim() || "Null",
            //         producthandle
            //     );
            // } catch (error) { }
            // // console.log(price);

            // try {
            //     link = await page.evaluate(
            //         (el) => el.querySelector(" .core")?.getAttribute("href") || "Null",
            //         producthandle
            //     );
            // } catch (error) { }

            // try {
            //     img = await page.evaluate(
            //         (el) =>
            //             el.querySelector("article .img-c img")?.getAttribute("data-src") ||
            //             "Null",
            //         producthandle
            //     );
            // } catch (error) { }

            // if (title !== "Null" && price !== "Null") {
            //     const product = {
            //         title,
            //         price,
            //         link: `https://www.jumia.com.eg${link}`,
            //         img,
            //     };
            //     products.push(product);
            // }
        }

        
    

    // console.log(products);

    await page.close();
    return products;
}

module.exports = scrapeCompuMart;
// Example usage:
scrapeCompuMart("RTX 4060");
