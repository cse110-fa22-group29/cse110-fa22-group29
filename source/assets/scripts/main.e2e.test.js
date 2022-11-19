import {strict as assert} from "node:assert";
import {describe, it, before, after} from "mocha";
import puppeteer from "puppeteer-core";
import { exit } from "node:process";

describe("test App end to end", async () => {

	let browser;
	let page;

	before(async () => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		try{
			await page.goto("http://localhost:8080", {timeout: 1000});
		}
		catch (error) {
			console.log("❌ failed to connect to localhost webserver on port 8080");
			exit(1);
		}
	});

	describe("test simple properties", async () => {
		it("page should have correct title", async () => {
			assert.strictEqual(await page.title(), "Food Journal");
		});
	});

	describe("test create 1 new review", async () => {
		it("create 1 new review", async () => {

		});

		it("check details page", async () => {
		
		});
	
		it("check home page", async () => {
			
		});
	});

	describe("test read 1 review after refresh", async () => {
		it("refresh page", async () => {

		});

		it("check details page", async () => {
			
		});

		it("check home page", async () => {
			
		});
	});

	describe("test update 1 review", async () => {

		it("update 1 review", async () => {
			// Get the only review card and click it
			let review_card = await page.$("review-card");
			await review_card.click();

			await page.waitForNavigation();

			// Click the button to show update form
			let update_btn = await page.$("update-btn");
			await update_btn.click();

			// Set text fields
			await page.$eval("#mealImg", el => el.value = "updated src");
			await page.$eval("#imgAlt", el => el.value = "updated alt");
			await page.$eval("#mealName", el => el.value = "updated name");
			await page.$eval("#comments", el => el.value = "updated comment");
			await page.$eval("#restaurant", el => el.value = "updated restaurant");

			// Get all tag elements and click them to delete them
			let tag_items = await page.$$(".tag");
			for(let i = 0; i < tag_items.length; i++){
				await tag_items.click();
			}

			// Get the button needed to add new tags
			let tag_btn = await page.$("#tag-add-btn");
			for(let i = 0; i < 5; i++){
				await page.$eval("#tag-form", (el, value) => el.value = `tag -${value}`, i);
				tag_btn.click();
			}

			// Select a new rating of 1 star
			let rating_select = await page.$("#s1");
			rating_select.click();

			// Click the save button to save updates
			let save_btn = await page.$("#save-btn");
			save_btn.click();
		});

		it("check details page", async () => {
			// Get the review image and check src and alt
			let img = await page.$("#d-mealImg");
			let imgSrc = await img.getProperty("src");
			let imgAlt = await img.getProperty("alt");
			// Check src and alt
			assert.strictEqual(await imgSrc.jsonValue(), "updated src");
			assert.strictEqual(await imgAlt.jsonValue(), "updated alt");

			// Get the title, comment, and restaurant
			let title = await page.$("#d-mealName");
			let title_text = await title.getProperty("innerText");
			let comment = await page.$("#d-comments");
			let comment_text = await comment.getProperty("innerText");
			let restaurant = await page.$("#d-restaurant");
			let restaurant_text = await restaurant.getProperty("innerText");
			// Check title, comment, and restaurant
			assert.strictEqual(await title_text.jsonValue(), "updated name");
			assert.strictEqual(await comment_text.jsonValue(), "updated comment");
			assert.strictEqual(await restaurant_text.jsonValue(), "updated restaurant");
			
			// Check tags
			let tags = page.$(".tag");
			for(let i = 0; i < tags.length; i++){
				let tag_text = await tags[i].getProperty("innerText");
				assert.strictEqual(await tag_text.jsonValue(), `tag -${i}`);
			}

			// Check stars
			let stars = await page.$("#d-rating");
			let stars_src = await stars.getProperty("src");
			assert.strictEqual(await stars_src.jsonValue(), "./assets/images/icons/1-star.svg");
		});

		it("check home page", async () => {
			// Click the button to return to the home page
			let home_btn = await page.$("#home-btn");
			home_btn.click();

			await page.waitForNavigation();

			// Get the review card again and get its shadowRoot
			let review_card = await page.$("review-card");
			let shadowRoot = await review_card.getProperty("shadowRoot");

			// Get the review image and check src and alt
			let img = await shadowRoot.$("#a-mealImg");
			let imgSrc = await img.getProperty("src");
			let imgAlt = await img.getProperty("alt");
			// Check src and alt
			assert.strictEqual(await imgSrc.jsonValue(), "updated src");
			assert.strictEqual(await imgAlt.jsonValue(), "updated alt");

			// Get the title, comment, and restaurant
			let title = await shadowRoot.$("#a-mealName");
			let title_text = await title.getProperty("innerText");
			let comment = await shadowRoot.$("#a-comments");
			let comment_text = await comment.getProperty("innerText");
			let restaurant = await shadowRoot.$("#a-restaurant");
			let restaurant_text = await restaurant.getProperty("innerText");
			// Check title, comment, and restaurant
			assert.strictEqual(await title_text.jsonValue(), "updated name");
			assert.strictEqual(await comment_text.jsonValue(), "updated comment");
			assert.strictEqual(await restaurant_text.jsonValue(), "updated restaurant");
			
			// Check tags
			let tags = shadowRoot.$(".tag");
			for(let i = 0; i < tags.length; i++){
				let tag_text = await tags[i].getProperty("innerText");
				assert.strictEqual(await tag_text.jsonValue(), `tag -${i}`);
			}

			// Check stars
			let stars = await shadowRoot.$("#a-rating");
			let stars_src = await stars.getProperty("src");
			assert.strictEqual(await stars_src.jsonValue(), "./assets/images/icons/1-star.svg");
		});

	});

	describe("test delete 1 review", () => {
		it("delete 1 review", async () => {
			// Get the only review card and click it
			let review_card = await page.$("review-card");
			await review_card.click();

			// Get the delete button and click it
			let delete_btn = await page.$("#delete-btn");
			await delete_btn.click();

			// Check that the card was correctly removed (there should be no remaining cards)
			review_card = await page.$("#review-card");
			assert.strictEqual(review_card, null);
		});
	});

	after(async () => {
		await page.close();
		await browser.close();
	});
});