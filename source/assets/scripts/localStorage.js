//
//module.exports = {getReviewsFromStorage, saveReviewsToStorage};

/**
 * @returns {Array<Object>} An array of reviews found in localStorage
 */
export function getReviewsFromStorage() {
	let result = JSON.parse(localStorage.getItem('reviews'))
	if (result) {
		return result;
	}
	return new Array(0);
}

/**
 * Takes in an array of reviews, converts it to a string, and then
 * saves that string to 'reviews' in localStorage
 * @param {Array<Object>} reviews An array of reviews
 */
export function saveReviewsToStorage(reviews) {
	localStorage.setItem('reviews', JSON.stringify(reviews));
}
