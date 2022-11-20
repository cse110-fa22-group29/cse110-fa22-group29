import {strict as assert} from "node:assert";

/**
 * Fills out a create or update review form
 * @param {Object} page the page object which contains the create or update form
 * @param {Object} review review data to input into the form 
 */
export async function setReviewForm(page, review) {
	
	// Set text fields
	await page.$eval("#imgAlt", (el, value) => el.value = value, review.imgAlt);
	await page.$eval("#mealName", (el, value) => el.value = value, review.mealName);
	await page.$eval("#comments", (el, value) => el.value = value, review.comments);
	await page.$eval("#restaurant", (el, value) => el.value = value, review.restaurant);

	// Get all tag elements and click them to delete them
	let tag_items = await page.$$(".tag");
	if(tag_items !== null){
		for(let i = 0; i < tag_items.length; i++){
			await tag_items[i].click();
		}
	}

	// Get the button needed to add new tags
	let tag_btn = await page.$("#tag-add-btn");
	for(let i = 0; i < review.tags.length; i++){
		await page.$eval("#tag-form", (el, value) => el.value = value, review.tags[i]);
		await tag_btn.click();
	}

	// Select a new rating
	let rating_select = await page.$(`#s${review.rating}-select`);
	await rating_select.click({delay: 100});
}

/**
 * Tests a page or shadowDOM for correct element text, src, or alt values
 * @param {Object} root page or shodowDOM to test
 * @param {string} prefix prefix character for element IDs
 * @param {Object} expected values for eahc element
 */
export async function checkCorrectness(root, prefix, expected){
	// Get the review image and check src and alt
	let img = await root.$(`#${prefix}-mealImg`);
	let imgSrc = await img.getProperty("src");
	let imgAlt = await img.getProperty("alt");
	// Check src and alt
	assert.strictEqual(await imgSrc.jsonValue(), expected.imgSrc);
	assert.strictEqual(await imgAlt.jsonValue(), expected.imgAlt);

	// Get the title, comment, and restaurant
	let title = await root.$(`#${prefix}-mealName`);
	let title_text = await title.getProperty("innerText");
	let comment = await root.$(`#${prefix}-comments`);
	let comment_text = await comment.getProperty("innerText");
	let restaurant = await root.$(`#${prefix}-restaurant`);
	let restaurant_text = await restaurant.getProperty("innerText");

	// Check title, comment, and restaurant
	assert.strictEqual(await title_text.jsonValue(), expected.mealName);
	assert.strictEqual(await comment_text.jsonValue(), expected.comments);
	assert.strictEqual(await restaurant_text.jsonValue(), expected.restaurant);

	// Check tags
	let tags = await root.$$(".tag");
	assert.strictEqual(await tags.length, expected.tags.length);
	for(let i = 0; i < expected.tags.length; i++){
		let tag_text = await tags[i].getProperty("innerText");
		assert.strictEqual(await tag_text.jsonValue(), expected.tags[i]);
	}

	// Check stars
	let stars = await root.$(`#${prefix}-rating`);
	let stars_src = await stars.getProperty("src");
	assert.strictEqual(await stars_src.jsonValue(), expected.rating);
}