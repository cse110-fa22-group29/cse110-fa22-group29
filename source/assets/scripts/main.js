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
		//TODO: want to append it to whatever the box is in layout 
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
}

const registerServiceWorker = async () => {
	if ("serviceWorker" in navigator) {
		try {
			const registration = await navigator.serviceWorker.register("./sw.js", {
				scope: "./",
			});
		} catch (error) {
			console.error(`Registration failed with ${error}`);
		}
	}
};
registerServiceWorker();