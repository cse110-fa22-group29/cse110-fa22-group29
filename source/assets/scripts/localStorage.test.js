import {strict as assert} from "node:assert";
import {describe, it, before, after} from "mocha";
import {newReviewToStorage, getReviewFromStorage, updateReviewToStorage, deleteReviewFromStorage, getAllReviewsFromStorage} from "./localStorage.js";

describe("test app localStorage interaction", () => {
	
	before(() => {
		localStorage.clear();
	});

	it("test localStorage state after init", () => {
		assert.deepEqual(getAllReviewsFromStorage(), []);
		assert.deepEqual(JSON.parse(localStorage.getItem("activeIDS")), []);
		assert.strictEqual(JSON.parse(localStorage.getItem("nextID")), 0);
	});

	it("test localStorage state after adding one review", () => {
		let review = {
			"imgSrc": "sample src",
			"imgAlt": "sample alt",
			"mealName": "sample name",
			"restaurant": "sample restaurant",
			"rating": 5,
			"tags": ["tag 1", "tag  2", "tag 3"]
		};

		newReviewToStorage(review);

		review.reviewID = 0;

		assert.deepEqual(getAllReviewsFromStorage(), [review]);
		assert.deepEqual(getReviewFromStorage(0), review);
		assert.deepEqual(JSON.parse(localStorage.getItem("activeIDS")), [0]);
		assert.strictEqual(JSON.parse(localStorage.getItem("nextID")), 1);
	});

	it("test localStorage state during adding 999 reviews", () => {
		let reviews = getAllReviewsFromStorage();
		let ids = [0];

		for(let i = 1; i < 1000; i++){
			ids.push(i);
			let new_review = {
				"imgSrc": `sample src ${i}`,
				"imgAlt": `sample alt ${i}`,
				"mealName": `sample name ${i}`,
				"restaurant": `sample restaurant ${i}`,
				"rating": i,
				"tags": [`tag ${3*i}`, `tag ${3*i + 1}`, `tag ${3*i + 2}`]
			};

			newReviewToStorage(new_review);

			new_review.reviewID = i;
			reviews.push(new_review);

			assert.deepEqual(getAllReviewsFromStorage(), reviews);
			assert.deepEqual(getReviewFromStorage(i), new_review);
			assert.deepEqual(JSON.parse(localStorage.getItem("activeIDS")), ids);
			assert.strictEqual(JSON.parse(localStorage.getItem("nextID")), (i+1));
		}
	}).timeout(5000);

	it("test localStorage state during updating 1000 reviews", () => {
		let reviews = getAllReviewsFromStorage();
		let ids = JSON.parse(localStorage.getItem("activeIDS"));

		for(let i = 0; i < 1000; i++){
			let new_review = {
				"imgSrc": `updated sample src ${i}`,
				"imgAlt": `updated sample alt ${i}`,
				"mealName": `updated sample name ${i}`,
				"restaurant": `updated sample restaurant ${i}`,
				"rating": i*2+i,
				"tags": [`tag ${3*i}`, `tag ${3*i + 1}`, `tag ${3*i + 2}`]
			};
			new_review.reviewID = i;

			reviews[i] = new_review;

			updateReviewToStorage(i, new_review);

			assert.deepEqual(getAllReviewsFromStorage(), reviews);
			assert.deepEqual(getReviewFromStorage(i), new_review);
			assert.deepEqual(JSON.parse(localStorage.getItem("activeIDS")), ids);
			assert.strictEqual(JSON.parse(localStorage.getItem("nextID")), 1000);
		}
	}).timeout(5000);

	it("test localStorage state during deleting 1000 reviews", () => {
		let reviews = getAllReviewsFromStorage();
		let ids = JSON.parse(localStorage.getItem("activeIDS"));

		for(let i = 999; i >= 0; i--){
			deleteReviewFromStorage(i);
			ids.pop();
			reviews.pop();

			assert.deepEqual(getAllReviewsFromStorage(), reviews);
			assert.deepEqual(JSON.parse(localStorage.getItem("activeIDS")), ids);
			assert.strictEqual(JSON.parse(localStorage.getItem("nextID")), 1000);
		}
	}).timeout(5000);

	after(() => {});
});
