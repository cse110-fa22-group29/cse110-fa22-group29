import {strict as assert} from "node:assert";
import {describe, it, beforeEach} from "mocha";
import {saveReviewsToStorage, getReviewsFromStorage} from "./localStorage.js";

beforeEach(() => {
	localStorage.clear();
});

describe("test app localStorage interaction", () => {
	it("get after init", () => {
		assert.deepEqual(getReviewsFromStorage(), []);
	});
	it("store one then get", () => {
		let reviews = [{
			"imgSrc": "sample src",
			"imgAlt": "sample alt",
			"mealName": "sample name",
			"restaurant": "sample restaurant",
			"rating": 5,
			"tags": ["tag 1", "tag  2", "tag 3"]
		}];

		saveReviewsToStorage(reviews);
		assert.deepEqual(getReviewsFromStorage(), reviews);
	});
	it("repeated store one more and get", () => {
		let reviews = [];

		assert.deepEqual(getReviewsFromStorage(), reviews);

		for(let i = 0; i < 1000; i++){
			reviews = getReviewsFromStorage();
			
			reviews.push(
				{
					"imgSrc": `sample src ${i}`,
					"imgAlt": `sample alt ${i}`,
					"mealName": `sample name ${i}`,
					"restaurant": `sample restaurant ${i}`,
					"rating": i,
					"tags": [`tag ${3*i}`, `tag ${3*i + 1}`, `tag ${3*i + 2}`]
				}
			);
			saveReviewsToStorage(reviews);
			assert.deepEqual(getReviewsFromStorage(), reviews);
		}
	}).timeout(10000);
});
