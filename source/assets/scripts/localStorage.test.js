import {strict as assert} from "node:assert";
import {describe, it, before, after} from "mocha";
import {newReviewToStorage, getReviewFromStorage, updateReviewToStorage, deleteReviewFromStorage, getAllReviewsFromStorage, getIDsByTag, getTopIDsFromStorage} from "./localStorage.js";

describe("test CRUD localStorage interaction", () => {
	
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
				"mealName": `sample name ${i}`,
				"restaurant": `sample restaurant ${i}`,
				"rating": i,
				"tags": [`tag ${3*i}`, `tag ${3*i + 1}`, `tag ${3*i + 2}`]
			};

			new_review.reviewID  = newReviewToStorage(new_review);
			reviews.push(new_review);

			assert.deepEqual(getAllReviewsFromStorage(), reviews);
			assert.deepEqual(getReviewFromStorage(i), new_review);
			assert.deepEqual(JSON.parse(localStorage.getItem("activeIDS")), ids);
			assert.strictEqual(JSON.parse(localStorage.getItem("nextID")), (i+1));
		}
	}).timeout(5000);

	it("test localStorage state during updating 1000 reviews", () => {
		for(let i = 0; i < 1000; i++){
			let old_review = getReviewFromStorage(i);
			let id = old_review.reviewID;

			let new_review = {
				"imgSrc": `updated sample src ${id}`,
				"mealName": `updated sample name ${id}`,
				"restaurant": `updated sample restaurant ${id}`,
				"reviewID": id,
				"rating": (id % 5) + 1,
				"tags": [`tag ${3*id}`, `tag ${3*id + 1}`, `tag ${3*id + 2}`]
			};

			updateReviewToStorage(id, new_review);

			let all_reviews = getAllReviewsFromStorage();
			let active_ids = JSON.parse(localStorage.getItem("activeIDS"));

			assert.deepEqual(all_reviews[999], new_review);
			assert.strictEqual(active_ids[999], id);
			assert.deepEqual(getReviewFromStorage(i), new_review);
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

	it("test localStorage state after all deletes", () => {
		assert.deepEqual(getAllReviewsFromStorage(), []);
	});

	after(() => {});
});

describe("test sort/filter localStorage interaction", () => {
	
	before(() => {
		localStorage.clear();
		getAllReviewsFromStorage();
	});

	it("add sample data for sort and filter", () => {
		for(let i = 0; i < 100; i++){
			let review = {
				"imgSrc": `sample src ${i}`,
				"mealName": `sample name ${i}`,
				"restaurant": `sample restaurant ${i}`,
				"rating": (i % 5) + 1,
				"tags": [`tag ${i%3}`, `tag ${i < 50}`, "tag x"]
			};

			newReviewToStorage(review);
		}
	});

	it("test getTopIDsFromStorage end behavior after create", () =>{
		let top_reviews = getTopIDsFromStorage();
		let prev = Infinity;
		for(let i = 0; i < top_reviews.length; i++){
			let review = getReviewFromStorage(top_reviews[i]);
			assert.strictEqual(review.rating <= prev, true);
		}
	});

	it("test getIDsByTag end behavior after create", () => {
		let specific_tagged_reviews = [];

		specific_tagged_reviews = getIDsByTag("tag 0");
		assert.strictEqual(specific_tagged_reviews.length, 34);
		for(let i = 0; i < specific_tagged_reviews.length; i++){
			let review = getReviewFromStorage(specific_tagged_reviews[i]);
			assert.strictEqual(review.tags.includes("tag 0"), true);
			assert.strictEqual(review.reviewID % 3, 0);
		}

		specific_tagged_reviews = getIDsByTag("tag 1");
		assert.strictEqual(specific_tagged_reviews.length, 33);
		for(let i = 0; i < specific_tagged_reviews.length; i++){
			let review = getReviewFromStorage(specific_tagged_reviews[i]);
			assert.strictEqual(review.tags.includes("tag 1"), true);
			assert.strictEqual(review.reviewID % 3, 1);
		}

		specific_tagged_reviews = getIDsByTag("tag 2");	
		assert.strictEqual(specific_tagged_reviews.length, 33);
		for(let i = 0; i < specific_tagged_reviews.length; i++){
			let review = getReviewFromStorage(specific_tagged_reviews[i]);
			assert.strictEqual(review.tags.includes("tag 2"), true);
			assert.strictEqual(review.reviewID % 3, 2);
		}

		specific_tagged_reviews = getIDsByTag("tag true");		
		assert.strictEqual(specific_tagged_reviews.length, 50);
		for(let i = 0; i < specific_tagged_reviews.length; i++){
			let review = getReviewFromStorage(specific_tagged_reviews[i]);
			assert.strictEqual(review.tags.includes("tag true"), true);
			assert.strictEqual(review.reviewID < 50, true);
		}

		specific_tagged_reviews = getIDsByTag("tag false");		
		assert.strictEqual(specific_tagged_reviews.length, 50);
		for(let i = 0; i < specific_tagged_reviews.length; i++){
			let review = getReviewFromStorage(specific_tagged_reviews[i]);
			assert.strictEqual(review.tags.includes("tag false"), true);
			assert.strictEqual(review.reviewID >= 50, true);
		}

		specific_tagged_reviews = getIDsByTag("tag x");		
		assert.strictEqual(specific_tagged_reviews.length, 100);

		specific_tagged_reviews = getIDsByTag("tag y");		
		assert.deepEqual(specific_tagged_reviews, []);
	});

	it("update sample data for sort and filter", () => {
		for(let i = 0; i < 100; i++){
			let old_review = getReviewFromStorage(i);
			let new_review = {
				"imgSrc": `sample src ${i}`,
				"mealName": `sample name ${i}`,
				"restaurant": `sample restaurant ${i}`,
				"reviewID": old_review.reviewID,
				"rating": (i % 5) + 1,
				"tags": [`tag ${i % 4}`, `tag ${i < 37}`, "tag y"]
			};

			updateReviewToStorage(old_review.reviewID, new_review);
		}
	});

	it("test getTopIDsFromStorage end behavior after create", () =>{
		let top_reviews = getTopIDsFromStorage();
		let prev = Infinity;
		for(let i = 0; i < top_reviews.length; i++){
			let review = getReviewFromStorage(top_reviews[i]);
			assert.strictEqual(review.rating <= prev, true);
		}
	});

	it("test getIDsByTag end behavior after update", () => {
		let specific_tagged_reviews = [];

		specific_tagged_reviews = getIDsByTag("tag 0");
		assert.strictEqual(specific_tagged_reviews.length, 25);
		for(let i = 0; i < specific_tagged_reviews.length; i++){
			let review = getReviewFromStorage(specific_tagged_reviews[i]);
			assert.strictEqual(review.tags.includes("tag 0"), true);
			assert.strictEqual(review.reviewID % 4, 0);
		}

		specific_tagged_reviews = getIDsByTag("tag 1");
		assert.strictEqual(specific_tagged_reviews.length, 25);
		for(let i = 0; i < specific_tagged_reviews.length; i++){
			let review = getReviewFromStorage(specific_tagged_reviews[i]);
			assert.strictEqual(review.tags.includes("tag 1"), true);
			assert.strictEqual(review.reviewID % 4, 1);
		}

		specific_tagged_reviews = getIDsByTag("tag 2");
		assert.strictEqual(specific_tagged_reviews.length, 25);
		for(let i = 0; i < specific_tagged_reviews.length; i++){
			let review = getReviewFromStorage(specific_tagged_reviews[i]);
			assert.strictEqual(review.tags.includes("tag 2"), true);
			assert.strictEqual(review.reviewID % 4, 2);
		}

		specific_tagged_reviews = getIDsByTag("tag 3");
		assert.strictEqual(specific_tagged_reviews.length, 25);
		for(let i = 0; i < specific_tagged_reviews.length; i++){
			let review = getReviewFromStorage(specific_tagged_reviews[i]);
			assert.strictEqual(review.tags.includes("tag 3"), true);
			assert.strictEqual(review.reviewID % 4, 3);
		}

		specific_tagged_reviews = getIDsByTag("tag true");
		assert.strictEqual(specific_tagged_reviews.length, 37);
		for(let i = 0; i < specific_tagged_reviews.length; i++){
			let review = getReviewFromStorage(specific_tagged_reviews[i]);
			assert.strictEqual(review.tags.includes("tag true"), true);
			assert.strictEqual(review.reviewID < 37, true);
		}

		specific_tagged_reviews = getIDsByTag("tag false");
		assert.strictEqual(specific_tagged_reviews.length, 63);
		for(let i = 0; i < specific_tagged_reviews.length; i++){
			let review = getReviewFromStorage(specific_tagged_reviews[i]);
			assert.strictEqual(review.tags.includes("tag false"), true);
			assert.strictEqual(review.reviewID >= 37, true);
		}

		specific_tagged_reviews = getIDsByTag("tag x");
		assert.deepEqual(specific_tagged_reviews, []);

		specific_tagged_reviews = getIDsByTag("tag y");
		assert.strictEqual(specific_tagged_reviews.length, 100);
	});

	it("delete all sample data for sort and filter", () => {
		for(let i = 0; i < 100; i++){
			deleteReviewFromStorage(i);
		}
	});

	it("test getTopIDsFromStorage end behavior after delete", () =>{
		for(let i = 0; i <= 100; i++){
			let top_reviews = getTopIDsFromStorage(i);
			assert.deepEqual(top_reviews, []);
		}
	});

	it("test getIDsByTag end behavior after delete", () => {
		let specific_tagged_reviews = [];

		specific_tagged_reviews = getIDsByTag("tag 0");
		assert.deepEqual(specific_tagged_reviews, []);

		specific_tagged_reviews = getIDsByTag("tag 1");
		assert.deepEqual(specific_tagged_reviews, []);

		specific_tagged_reviews = getIDsByTag("tag 2");
		assert.deepEqual(specific_tagged_reviews, []);

		specific_tagged_reviews = getIDsByTag("tag 3");
		assert.deepEqual(specific_tagged_reviews, []);

		specific_tagged_reviews = getIDsByTag("tag true");
		assert.deepEqual(specific_tagged_reviews, []);

		specific_tagged_reviews = getIDsByTag("tag false");
		assert.deepEqual(specific_tagged_reviews, []);

		specific_tagged_reviews = getIDsByTag("tag x");
		assert.deepEqual(specific_tagged_reviews, []);

		specific_tagged_reviews = getIDsByTag("tag y");
		assert.deepEqual(specific_tagged_reviews, []);
	});

	after(() => {});
});