// main.js
import {getAllReviewsFromStorage} from "./localStorage.js";

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

function init() {
	// Get the reviews from localStorage
	let reviews = getAllReviewsFromStorage();
	// Add each reviews to the <main> element
	addReviewsToDocument(reviews);
	// Add the event listeners to the form elements
	initHomepage();
}


/**
 * Takes the active IDs, finds corresponding review data, and
 * adds those reviews to the page.
 * 
 * @param {Array<Object>} reviews An array of active review ID
 */
function addReviewsToDocument(reviews) {
	// Grabs the review container and adds each review
	let box = document.getElementById("review-container");
	reviews.forEach(review => {
		let newReview = document.createElement("review-card");
		newReview.data = review;
		box.append(newReview);
	});
}

/**
 * Adds the necessary create button for the homepage
 */
function initHomepage() {

	// Creates button that would lead to the review form
	let createBtn = document.getElementById("create-btn");
	createBtn.addEventListener("click", function(){
		window.location.assign("./CreatePage.html");
	});
}
