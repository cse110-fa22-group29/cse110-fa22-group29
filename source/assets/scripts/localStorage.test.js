const {getReviewsFromStorage, saveReviewsToStorage} = require("./localStorage");
const {environment} = require("./testenv");
const assert = require("assert");
const {describe, it, beforeEach} = require("mocha");

beforeEach(() => {
	window = environment();
	localStorage = window.localStorage;
});

describe("test app localStorage interaction", () => {
	it("get after init", () => {
		assert.deepEqual(getReviewsFromStorage(), []);
	});
	it("store one then get", () => {
		reviews = [{
			"imgSrc": "sample src",
			"imgAlt": "sample alt",
			"mealName": "sample name",
			"restaurant": "sample restaurant",
			"rating": 5
		}];

		saveReviewsToStorage(reviews);
		assert.deepEqual(getReviewsFromStorage(), reviews);
	})
});