/**
 * @returns {Array<Object>} An array of reviews found in localStorage
 */
export function getReviewsFromStorage() {
	if (!(localStorage.getItem("activeIDS"))) {
		// we wanna init the active ID array and start the nextID count
		localStorage.setItem("activeIDS", JSON.stringify([]));
		localStorage.setItem("nextID",  JSON.stringify(0));
	}
	//iterate thru activeIDS
	let activeIDS = JSON.parse(localStorage.getItem("activeIDS"));
	let reviews = []
	for (let i = 0; i < activeIDS.length; i++) {
		let currReview = JSON.parse(localStorage.getItem('review'+activeIDS[i]));
		reviews.push(currReview);
	}
	return reviews;
}

/**
 * Takes in an array of reviews, converts it to a string, and then
 * saves that string to 'reviews' in localStorage
 * @param {Array<Object>} reviews An array of reviews
 */
export function saveReviewsToStorage(reviews) {
	localStorage.setItem(`review${reviewId}`, JSON.stringify(reviews));
}
