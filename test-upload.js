import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    try {
        const page = await browser.newPage();
        await page.goto('http://localhost:5173/login');

        // Wait for the login form
        await page.waitForSelector('.auth-form');

        // Click demo artist button
        const demoBtns = await page.$$('.auth-demo-btn');
        for (const btn of demoBtns) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text.includes('Artist')) {
                await btn.click();
                break;
            }
        }

        // Wait for credentials to populate then submit
        await page.waitForTimeout(500);
        await page.click('button[type="submit"]');

        // Wait for dashboard to load
        await page.waitForSelector('.artist-dashboard');
        console.log('Logged in successfully to Artist Dashboard.');

        // Count artworks before
        const artworksBefore = await page.$$('.artist-art-card');
        console.log(`Artworks before upload: ${artworksBefore.length}`);

        // Go to upload page
        await page.goto('http://localhost:5173/dashboard/artist/upload');
        await page.waitForSelector('form');

        // Fill form
        await page.type('input[name="title"]', 'Puppeteer Symphony', { delay: 10 });
        await page.type('input[name="price"]', '4500', { delay: 10 });
        await page.type('input[name="medium"]', 'Automation', { delay: 10 });

        // Submit
        await page.click('button[type="submit"]');

        // Wait for redirect to happen naturally
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(() => { });
        await page.waitForSelector('.artist-dashboard');

        // Count artworks after
        const artworksAfter = await page.$$('.artist-art-card');
        console.log(`Artworks after upload: ${artworksAfter.length}`);

        if (artworksAfter.length > artworksBefore.length) {
            console.log('SUCCESS: New artwork appears in the dashboard!');
        } else {
            console.log('FAIL: New artwork did not appear in the dashboard.');
        }

        // Verify in Gallery
        await page.goto('http://localhost:5173/gallery');
        await page.waitForSelector('.gallery-grid');

        const pageText = await page.evaluate(() => document.body.innerText);
        if (pageText.includes('Puppeteer Symphony')) {
            console.log('SUCCESS: New artwork appears in the public gallery!');
        } else {
            console.log('FAIL: New artwork not found in the public gallery.');
        }

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await browser.close();
    }
})();
