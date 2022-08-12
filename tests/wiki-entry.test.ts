import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

const rootURL = 'https://www.wikipedia.org/';


describe('Wikipedia entry page:', () => {
	let driver: WebDriver
	beforeAll(async ()=>{
		const options = new chrome.Options();
		options.addArguments("--lang=en");
		options.addArguments('headless');
		options.addArguments('--log-level=3');
		driver = await new Builder()
			.forBrowser('chrome')
			.setChromeOptions(options)
			.build();
			
	})
	test('it should be accessible in browser by link https://www.wikipedia.org/', async () => {
		driver.get(rootURL);
		const slogan = await driver.wait(until.elementLocated(By.xpath('//*[@data-jsl10n="portal.slogan"]')));
		
		const actual = await slogan.getText();
		const expected = 'The Free Encyclopedia';
		expect(actual).toContain(expected);
	});

	test('it should include localization dropdown list', async ()=>{
		const localizationList = await driver.wait(until.elementLocated(By.id('js-lang-list-button')));
		
		const actual = await localizationList.getText();
		const expected = 'Read Wikipedia in your language';
		expect(actual).toContain(expected);

	})

	test('it should include Ukrainian localization in the list', async ()=>{
		const localizationList = await driver.wait(until.elementLocated(By.id('js-lang-list-button')));
		localizationList.click();
		const uaLocaleLink = await driver.wait(until.elementLocated(By.xpath('//a[@lang="uk"]')));
		
		const actual = await driver.wait(until.elementIsVisible(uaLocaleLink)).getText();
		const expected = 'Українська';
		expect(actual).toContain(expected);
	})

	test.skip('it should', async ()=>{
		const el = await driver.wait(until.elementLocated(By.id('js-link-box-uk')));
		el.click();
	})


	afterEach(async ()=>{
		// await new Promise(r => setTimeout(r, 1000));
	})
	afterAll(()=>{
		driver.quit();
	})
});
