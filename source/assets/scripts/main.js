// main.js
import {getAllReviewsFromStorage, getTopReviewsFromStorage, getReviewsByTag} from "./localStorage.js";

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

function init() {
	// Get the reviews from localStorage
	let reviews = getAllReviewsFromStorage();
	// Add each reviews to the <main> element
	addReviewsToDocument(reviews);
	// Add the event listeners to the form elements
	initFormHandler();
}


/**
 * @param {Array<Object>} reviews An array of reviews
 */
function addReviewsToDocument(reviews) {
	let reviewBox = document.getElementById("review-container");
	reviews.forEach(review => {
		let newReview = document.createElement("review-card");
		newReview.data = review;
		reviewBox.append(newReview);
	});

}

/**
 * Adds the necessary event handlers to <form> and the clear storage
 * <button>.
 */
function initFormHandler() {

	//btn to create form (could be its own function?)
	let createBtn = document.getElementById("create-btn");
	createBtn.addEventListener("click", function(){
		window.location.assign("./CreatePage.html");
	});

	let ratingBtn = document.getElementById("rating-btn");
	ratingBtn.addEventListener("click", function() {
		let reviewBox = document.getElementById("review-container");
		while(reviewBox.firstChild){
			reviewBox.removeChild(reviewBox.firstChild);
		}
		let reviewArr = getTopReviewsFromStorage(12);
		addReviewsToDocument(reviewArr);
	});

	//grabbing search field
	let searchField = document.getElementById("search-bar");
	let searchBtn = document.getElementById("search-btn");
	//adding search functionality
	searchBtn.addEventListener('click', function(){
		let reviewBox = document.getElementById("review-container");
		//clearing after a search 
		while(reviewBox.firstChild){
			reviewBox.removeChild(reviewBox.firstChild);
		}
		let reviewArr = getReviewsByTag(searchField.value);
		addReviewsToDocument(reviewArr);
	})	

	
}
