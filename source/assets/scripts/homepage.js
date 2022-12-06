// homepage.js
import { getIDsByTag, getIDsFromStorage, getReviewFromStorage, getTopIDsFromStorage } from "./localStorage.js";

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

function init() {
	//initial population of review container
	sortAndFilter(false, null);
	//Add the event listeners to dropdown and search bar
	initFormHandler();
}

/**
 * @param {Array<Object>} reviews An array of reviews
 */
function addReviewsToDocument(reviews) {
	let reviewBox = document.getElementById("review-container");
	reviews.forEach((review) => {
		let newReview = document.createElement("review-card");
		newReview.data = review;
		reviewBox.append(newReview);
	});
}

/**
 * Adds the necessary event handlers to search-btn and sort
 */
function initFormHandler() {
	//grabbing search field
	let searchField = document.getElementById("search-bar");
	let searchBtn = document.getElementById("search-btn");
	let searchTag = null;
	//adding search functionality
	searchBtn.addEventListener("click", function () {
		searchTag = searchField.value;
		sortAndFilter(searchTag);
	});

	//for clearing tag filter
	let clearSearchBtn = document.getElementById("clear-search");
	clearSearchBtn.addEventListener("click", function () {
		searchTag = null;
		searchField.value = "";
		sortAndFilter(searchTag);
	});

	//sort by selected method
	let sortMethod = document.getElementById("sort");
	sortMethod.addEventListener("input", function () {
		sortAndFilter(searchTag);
	});
}

/**
 * Deciphers sort and filter to populate the review-container
 * @param {string} searchTag tag name to filter by
 */
function sortAndFilter(searchTag) {
	let reviewBox = document.getElementById("review-container");
	let sortMethod = document.getElementById("sort");
	//clear review container
	while (reviewBox.firstChild) {
		reviewBox.removeChild(reviewBox.firstChild);
	}
	let reviewIDs = [];
	//sort method: most recent
	if (sortMethod.value == "recent") {
		//tag filtered most recent
		if (searchTag) {
			reviewIDs = getIDsByTag(searchTag);
		}
		//most recent
		else {
			reviewIDs = getIDsFromStorage();
		}
		//reversed for recency
		loadReviews(0, reviewIDs);
	}
	//sort method: top rated
	else if (sortMethod.value == "top") {
		//tag filtered top rated
		if (searchTag) {
			//intersection of top ids list and ids by tag in top ids order
			reviewIDs = getTopIDsFromStorage().filter((x) => getIDsByTag(searchTag).includes(x));
		}
		//top rated
		else {
			reviewIDs = getTopIDsFromStorage();
		}
		loadReviews(0, reviewIDs);
	}
}

/**
 * Populate review-container with 9 more reviews
 * @param {number} index review index to begin with
 * @param {number[]} reviewIDs ordered array of reviews
 */
function loadReviews(index, reviewIDs) {
	let reviewBox = document.getElementById("review-container");
	let footer = document.querySelector("footer");
	// label if there are no reviews to display
	if (reviewIDs.length == 0) {
		let emptyLabel = document.createElement("label");
		emptyLabel.setAttribute("id", "empty");
		emptyLabel.innerText = "No Reviews To Display";
		reviewBox.append(emptyLabel);
	} else {
		let emptyLabel = document.getElementById("empty");
		if (emptyLabel) {
			reviewBox.removeChild(emptyLabel);
		}
	}
	let moreBtn = document.getElementById("more-btn");
	//delete load more button if exists
	if (moreBtn) {
		footer.removeChild(moreBtn);
	}
	let reviewArr = [];
	//check if there are more than 9 reviews left
	if (index + 9 > reviewIDs.length - 1) {
		//add remaining reviews to review container
		for (let i = index; i < reviewIDs.length; i++) {
			reviewArr.push(getReviewFromStorage(reviewIDs[i]));
		}
		addReviewsToDocument(reviewArr);
	} else {
		//add 9 more reviews to container
		for (let i = index; i < index + 9; i++) {
			reviewArr.push(getReviewFromStorage(reviewIDs[i]));
		}
		addReviewsToDocument(reviewArr);
		//create and add load more button
		moreBtn = document.createElement("button");
		moreBtn.setAttribute("id", "more-btn");
		moreBtn.innerText = "Load More";
		//if load more clicked, load 9 more
		moreBtn.addEventListener("click", function () {
			loadReviews(index + 9, reviewIDs);
		});
		footer.append(moreBtn);
	}
}

//setting up service worker
const registerServiceWorker = async () => {
	if ("serviceWorker" in navigator) {
		try {
			await navigator.serviceWorker.register("./sw.js", { scope: "./" });
		} catch (error) {
			console.error(`Registration failed with ${error}`);
		}
	}
};
registerServiceWorker();
