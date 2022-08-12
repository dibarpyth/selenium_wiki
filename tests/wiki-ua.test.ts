import { Builder, By, until, WebDriver, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

const rootURL = 'https://uk.wikipedia.org/wiki/';


describe('Wikipedia Ukrainian main page:', () => {
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
	test('it should has ukrainian content on this page', async () => {
		driver.get(rootURL);
		const slogan = await driver.wait(until.elementLocated(By.id('localNotice')));
		
		const actual = await slogan.getText();
		const expected = 'Російське вторгнення в Україну: як допомогти й отримати допомогу під час війни';
		expect(actual).toContain(expected);
	});

	test('it should include the search field with ukrainian label', async ()=>{
		const searchField = await driver.wait(until.elementLocated(By.xpath('//input[@type="search"]')));
		const searchFieldLabel = await searchField.getAttribute('placeholder');
		
		const expected = 'Пошук у Вікіпедії';
		expect(searchFieldLabel).toContain(expected);
	});

	test('it should lead to the page about Ukraine when input "Україна" term in the seatch field', async ()=>{
		const searchField = await driver.wait(until.elementLocated(By.xpath('//input[@type="search"]')));
		const searchFieldLabel = await searchField.getAttribute('placeholder');
		searchField.sendKeys('Україна');

		await driver.findElement(By.id('mw-searchButton')).submit();
		await driver.sleep(2000);
		const actual = await driver.wait(until.elementLocated(By.xpath('//h1[@id="firstHeading"]'))).getText();

		const expected = 'Україна';
		expect(actual).toContain(expected);
	})

	afterEach(async ()=>{
		// await new Promise(r => setTimeout(r, 1000));
	})
	afterAll(()=>{
		driver.quit();
	})
});
